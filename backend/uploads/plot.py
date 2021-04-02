import numpy as np
import json
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from matplotlib.animation import FuncAnimation


def update_line(num, data, line):
    line.set_data(data[..., :num])
    return line,

# Fixing random state for reproducibility
np.random.seed(19680801)


# Set up formatting for the movie files
Writer = animation.writers['ffmpeg']
writer = Writer(fps=66, metadata=dict(artist='Me'), bitrate=1800)

numTimestamps = 0
coords = []

with open('2021-03-05T104338.802Z.wavcoord.json') as f:
  data = json.load(f)
  numTimeStamps = len(data)
  for x, y, _ in data:
    coords.append((x, y))

im = plt.imread("bus.jpg")

# x = np.arange(612)
# y = np.random.random(612)

x = np.array([xVal for xVal, _ in coords])
y = np.array([yVal for _, yVal in coords])

# myDpi = 120

# fig = plt.figure(figsize = (612 / myDpi, 612 / myDpi), dpi = myDpi)
fig, ax = plt.subplots()
ax.imshow(im)
# plt.xlim([0, 611])
# plt.ylim([0, 611])
graph, = plt.plot([], [], 'o', color = 'r')

def animate(i):
    graph.set_data(x[i], y[i])
    return graph

ani = FuncAnimation(fig, animate, frames = numTimeStamps, interval=15)
ani.save('ani.mp4', writer=writer)