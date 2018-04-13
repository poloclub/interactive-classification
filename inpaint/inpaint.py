from PIL import Image
import numpy as np
import io
import array
import subprocess
import os
import sys

def inpaint(img_fn, mask_fn, out_fn):
    # Open the base image and convert it into an RGB uint8 array
    img = Image.open(img_fn, mode='r')
    arr = np.array(img)
    img = []
    for x in range(227):
        for y in range(227):
            img.append(arr[x][y][0])
            img.append(arr[x][y][1])
            img.append(arr[x][y][2])

    # Write RGB array to file for C program to read
    with open('.imgbytes', 'w') as f:
        for x in img:
            f.write(str(x) + " ")

    # Open the mask and convert it to an RGB uint8 array (any non-black pixel counted as mask)
    maskImg = Image.open(mask_fn, mode='r')
    arr = np.array(maskImg)
    mask = []
    for x in range(227):
        for y in range(227):
            if arr[x][y][0] > 0 or arr[x][y][1] > 0 or arr[x][y][2] > 0:
                mask.append(1)
            else:
                mask.append(0)

    # Write 1/0 array of mask to file
    with open('.maskbytes', 'w') as f:
        for x in mask:
            f.write(str(x) + " ")

    # Call the C program and read back the modified RGB array
    subprocess.call(['./prog'])
    with open('.imgbytes', 'r') as f:
        nums = [int(x) for x in f.readline().split(' ')[:-1]]
        ar = array.array('B', nums)

    # Clean up
    os.remove('.maskbytes')
    os.remove('.imgbytes')

    # Save image
    final = Image.frombytes("RGB", (227, 227), ar.tostring())
    final.save(out_fn)

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python3 bytes.py [input image filename] [mask filename] [output image filename]")
    else:
        a = sys.argv
        print("Running inpainting on image", a[1], "using mask", a[2], "writing to file", a[3])
        inpaint(a[1], a[2], a[3])