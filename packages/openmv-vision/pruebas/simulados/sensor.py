"""OpenMV sensor/image doubles for the host test: fixed blobs, line, tag and QR."""
import time

RGB565, GRAYSCALE, QVGA, QQVGA = 1, 2, 3, 4
state = {"size": QVGA}


class Clock:
    def tick(self): pass
    def fps(self): return 30.0


time.clock = Clock  # time.clock() only exists on the OpenMV firmware.


class Blob:
    def __init__(self, cx, cy, w, h, pixels): self._v = (cx, cy, w, h, pixels)
    def cx(self): return self._v[0]
    def cy(self): return self._v[1]
    def w(self): return self._v[2]
    def h(self): return self._v[3]
    def pixels(self): return self._v[4]
    def rotation(self): return 0.5


class Line:
    def line(self): return (150, 0, 170, 240)
    def theta(self): return 175
    def magnitude(self): return 42


class Tag:
    def __init__(self, id, w): self._id, self._w = id, w
    def id(self): return self._id
    def cx(self): return 80
    def cy(self): return 60
    def w(self): return self._w
    def h(self): return self._w
    def rotation(self): return 3.14159265 / 2


class Qr:
    def payload(self): return "SALIDA"


class Image:
    def width(self): return 320 if state["size"] == QVGA else 160
    def height(self): return 240 if state["size"] == QVGA else 120

    def find_blobs(self, thresholds, pixels_threshold=0, area_threshold=0, merge=False):
        assert thresholds == [(30, 100, -64, -8, -32, 32)], thresholds  # verde
        blobs = (Blob(200, 50, 20, 10, 200), Blob(100, 120, 40, 30, 500), Blob(5, 5, 2, 2, 4))
        return [blob for blob in blobs if blob.pixels() >= pixels_threshold]

    def get_regression(self, thresholds, robust=False):
        assert thresholds == [(0, 30, -20, 20, -20, 20)], thresholds  # negro a color
        return Line()

    def find_apriltags(self): return [Tag(3, 10), Tag(7, 30)]
    def find_qrcodes(self): return [Qr()]


def reset(): pass
def set_pixformat(value): state["format"] = value
def set_framesize(value): state["size"] = value
def skip_frames(time=0): pass
def set_auto_gain(value): state["gain"] = value
def set_auto_whitebal(value): state["whitebal"] = value
def snapshot(): return Image()
