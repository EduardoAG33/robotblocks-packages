"""Ejecuta el runtime real MicroPython con pines/IRQ/reloj simulados en CPython."""
import json
import math
import re
import types
from array import array
from pathlib import Path

pkg = Path(__file__).resolve().parents[1] / 'packages/encoder'
blocks = json.loads((pkg / 'blocks/index.json').read_text(encoding='utf-8'))
source = blocks[0]['generators']['micropython']['globals'][0]
cpp = blocks[0]['generators']['arduino']['globals'][0]
cpp_table = list(map(int, re.search(r'enc_tabla\[16\] = \{([^}]+)', cpp)[1].split(',')))

class Pointer:
    def __init__(self, data): self.data = data
    def __getitem__(self, i): return self.data[i]
    def __setitem__(self, i, v):
        self.data[i] = ((v + 2**31) % 2**32 - 2**31) if isinstance(self.data, array) else v

class Pin:
    IN = 0; PULL_UP = 1; IRQ_RISING = 1; IRQ_FALLING = 2
    def __init__(self, n, mode, pull): self.n = n; self.level = 0; self.handler = None; self.irq_calls = 0
    def value(self): return self.level
    def irq(self, trigger, handler):
        self.irq_calls += 1
        assert trigger == 3
        self.handler = handler

class Clock:
    now = 0
    def ticks_us(self): return self.now % 2**30
    def ticks_diff(self, a, b): return ((a-b + 2**29) % 2**30) - 2**29

clock = Clock()
irq_depth = 0
def disable():
    global irq_depth
    old = irq_depth
    irq_depth += 1
    return old
def enable(old):
    global irq_depth
    irq_depth = old
def fail(block, message): raise RuntimeError(message)
ns = dict(machine=types.SimpleNamespace(Pin=Pin, disable_irq=disable, enable_irq=enable),
          time=clock, math=math, array=array, micropython=types.SimpleNamespace(viper=lambda f:f),
          ptr8=Pointer, ptr32=Pointer, rb_fail=fail)
exec(source, ns)
assert [v if v < 128 else v-256 for v in ns['enc_tabla']] == cpp_table
call = lambda name,*args: ns['enc_'+name](*args)
def expect_error(action, message):
    try: action()
    except RuntimeError as error: assert message in str(error), str(error)
    else: raise AssertionError('Se esperaba error: '+message)

expect_error(lambda: call('cuentas',1,'test'), 'Configura los encoders')
expect_error(lambda: call('todos','test'), 'Configura los encoders')
expect_error(lambda: call('sentido',1,'invertido','test'), 'Configura los encoders')
expect_error(lambda: call('configurar',0,[('mismo',2,2,11,30,65)],'x4','test'), 'pines')
expect_error(lambda: call('configurar',0,[('uno',2,3,0,30,65)],'x4','test'), 'positivos')
expect_error(lambda: call('configurar',0,[('uno',2,3,11,30,65)]*7,'x4','test'), 'máximo')
expect_error(lambda: call('configurar',0,[('uno',2,3,11,30,65),('uno',4,5,11,30,65)],'x4','test'), 'nombres')
for i,(mode,sense) in enumerate([('x4','normal'),('x4','invertido'),('x2','normal'),('x2','invertido')]):
    call('configurar',i,[(str(i),2*i,2*i+1,11,9.7,65)],mode,'test')
    assert ns['enc_invertido'][i] == 0
    call('sentido',i+1,sense,'test')

def cycle(i, reverse=False):
    sequence = [2,3,1,0] if reverse else [1,3,2,0]
    for state in sequence:
        a,b = ns['enc_a'][i], ns['enc_b'][i]
        before_a, before_b = a.level, b.level
        a.level,b.level = state >> 1, state & 1
        if a.level != before_a and a.handler: a.handler(a)
        elif b.level != before_b and b.handler: b.handler(b)

for i,expected in enumerate([4,-4,2,-2]):
    cycle(i)
    assert call('cuentas',i+1,'test') == expected
    cycle(i,True)
    assert call('cuentas',i+1,'test') == 0
    cycle(i,True)
    assert call('cuentas',i+1,'test') == -expected

call('todos','test')
ns['enc_cuenta'][0] = 1320
ns['enc_estado'][0][0] = 1320
assert call('vueltas',1,'test') == 1
assert math.isclose(call('distancia',1,'cm','test'), math.pi*6.5)
assert round(call('distancia',1,'cm','test'),2) == 20.42
assert math.isclose(call('distancia',1,'mm','test'), math.pi*65)
clock.now = 19999
assert call('velocidad',1,'rpm','test') == 0
clock.now = 20000
assert math.isclose(call('velocidad',1,'rpm','test'),3000)
assert math.isclose(call('velocidad',1,'cm/s','test'),math.pi*6.5*50)
ns['enc_cuenta'][0] = 0
clock.now = 20001
assert call('velocidad',1,'rpm','test') == 3000
clock.now = 40000
assert call('velocidad',1,'rpm','test') == -3000
call('reiniciar',1,'test')
assert call('cuentas',1,'test') == call('velocidad',1,'rpm','test') == 0
clock.now = 2**30 - 10000
call('reiniciar',1,'test')
ns['enc_cuenta'][0] = 1320
clock.now += 20000
assert math.isclose(call('velocidad',1,'rpm','test'),3000)
# La suma nativa desborda como entero de 32 bits, sin excepciones en IRQ.
ns['enc_cuenta'][0] = 2**31 - 1
cycle(0)
assert call('cuentas',1,'test') == -2**31 + 3
# Una transición inválida (ambos canales cambian) no agrega cuentas en ×4.
call('reiniciar',1,'test')
ns['enc_a'][0].level=ns['enc_b'][0].level=1
call('flanco',0)
assert call('cuentas',1,'test') == 0
assert irq_depth == 0
expect_error(lambda: call('configurar',0,[('nuevo',20,21,11,30,65)],'x4','test'), 'una sola vez')
assert sum(p.irq_calls for p in ns['enc_a'] + ns['enc_b'] if p is not None) == 6
call('sentido',1,'invertido','test')
assert ns['enc_invertido'][0] == 1
assert call('velocidad',1,'rpm','test') == 0
assert sum(p.irq_calls for p in ns['enc_a'] + ns['enc_b'] if p is not None) == 6
print('Encoder: ×4/×2, ambos sentidos, inversión, transición inválida, distancia 20.42 cm, velocidad 20 ms, reinicios y desbordamientos: OK')
