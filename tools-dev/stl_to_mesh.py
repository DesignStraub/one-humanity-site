"""Pack binary STL parts into one small file for the gallery (assets/models/*.bin).

Format (little endian):
  uint32 header length, header JSON (bbox min/max in mm, parts with vertex/index counts),
  then per part: uint16 positions (x, y, z quantised to the bbox), uint16 or uint32 indices.
Vertices are welded, so the gallery can draw the facets with flat shading.

Usage: python3 tools-dev/stl_to_mesh.py out.bin name=file.stl [name=file.stl ...]
"""
import json, struct, sys


def read_stl(path):
    data = open(path, 'rb').read()
    count = struct.unpack_from('<I', data, 80)[0]
    tris = []
    for i in range(count):
        off = 84 + i * 50 + 12
        tris.append(struct.unpack_from('<9f', data, off))
    return tris


def main():
    out, specs = sys.argv[1], [a.split('=', 1) for a in sys.argv[2:]]
    parts = [(name, read_stl(path)) for name, path in specs]
    lo = [min(t[i + k] for _, tris in parts for t in tris for k in (0, 3, 6)) for i in range(3)]
    hi = [max(t[i + k] for _, tris in parts for t in tris for k in (0, 3, 6)) for i in range(3)]
    span = [max(h - l, 1e-6) for l, h in zip(lo, hi)]
    header, blobs = {'min': lo, 'max': hi, 'parts': []}, []
    for name, tris in parts:
        index_of, verts, idx = {}, [], []
        for t in tris:
            for k in range(3):
                q = tuple(round((t[k * 3 + i] - lo[i]) / span[i] * 65535) for i in range(3))
                if q not in index_of:
                    index_of[q] = len(verts)
                    verts.append(q)
                idx.append(index_of[q])
        wide = len(verts) > 65535
        pos = struct.pack('<%dH' % (len(verts) * 3), *[c for v in verts for c in v])
        ind = struct.pack('<%d%s' % (len(idx), 'I' if wide else 'H'), *idx)
        if len(pos) % 4: pos += b'\0' * (4 - len(pos) % 4)
        if len(ind) % 4: ind += b'\0' * (4 - len(ind) % 4)
        header['parts'].append({'name': name, 'vertices': len(verts), 'indices': len(idx), 'wide': wide,
                                'posBytes': len(pos), 'indBytes': len(ind)})
        blobs += [pos, ind]
    head = json.dumps(header, separators=(',', ':')).encode()
    head += b' ' * ((4 - (len(head) + 4) % 4) % 4)
    with open(out, 'wb') as f:
        f.write(struct.pack('<I', len(head)) + head + b''.join(blobs))
    print(json.dumps(header, indent=1))


main()
