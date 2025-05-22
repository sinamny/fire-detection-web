
Fire-seg-part1 - v20 2024-04-15 9:06pm
==============================

This dataset was exported via roboflow.com on April 22, 2025 at 3:02 PM GMT

Roboflow is an end-to-end computer vision platform that helps you
* collaborate with your team on computer vision projects
* collect & organize images
* understand and search unstructured image data
* annotate, and create datasets
* export, train, and deploy computer vision models
* use active learning to improve your dataset over time

For state of the art Computer Vision training notebooks you can use with this dataset,
visit https://github.com/roboflow/notebooks

To find over 100k other datasets and pre-trained models, visit https://universe.roboflow.com

The dataset includes 16879 images.
Fire-ZqbM are annotated in YOLOv11 format.

The following pre-processing was applied to each image:
* Auto-orientation of pixel data (with EXIF-orientation stripping)
* Resize to 800x800 (Fit (black edges))

The following augmentation was applied to create 3 versions of each source image:
* 50% probability of horizontal flip
* Randomly crop between 0 and 15 percent of the image
* Random rotation of between -10 and +10 degrees
* Random brigthness adjustment of between 0 and +10 percent
* Random exposure adjustment of between -9 and +9 percent
* Salt and pepper noise was applied to 0.11 percent of pixels

The following transformations were applied to the bounding boxes of each image:
* Random rotation of between -7 and +7 degrees
* Random brigthness adjustment of between 0 and +9 percent
* Random exposure adjustment of between -8 and +8 percent


