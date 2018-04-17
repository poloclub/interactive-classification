# Interactive Classification for Deep Learning Interpretation

We have designed and developed an interactive system that allows users to experiment with deep learning image classifiers and explore their robustness and sensitivity.
Users are able to remove selected areas of an image in real time with classical patch-based computer vision inpainting algorithms, which allows users to ask a variety of "what if" questions by experimentally modifying images and seeing how the deep learning model reacts.
The system also computes class activation maps for any selected class, which highlight the discriminative semantic regions of an image the model uses for classification.
The system runs fully in browser using Tensorflow.js and React, supporting classification models MobileNet and SqueezeNet.

<!-- VIDEO LINK -->

***

## Installation

Download or clone this repository:

```bash
git clone https://github.com/poloclub/interactive-classification.git
```

Within the cloned repo, install the required packages with yarn:

```bash
yarn

```

## Usage

To run, type:

```bash
yarn start

```

## License

MIT License. See [`LICENSE.md`](LICENSE.md).


## Contact

For questions or support [open an issue][issues].

[issues]: https://github.com/poloclub/interactive-classification/issues
