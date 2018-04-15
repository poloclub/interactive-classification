// COMPILE WITH: gcc resynth.c -L. -lresynthesizer -lm -lglib-2.0 -o prog

#include <stdio.h>
#include <stdlib.h>

// Following structs are from Resynthesizer

typedef struct _ImageBuffer 
{
  unsigned char * data; // data must be sequential RGBA for image, sequence of bytes for a mask
  unsigned int width;
  unsigned int height;
  size_t rowBytes;    // Row stride.  unsigned int? doesn't really describe size of a type, but count of bytes in pixmap row
} ImageBuffer;


typedef struct ImageSynthParametersStruct {
  
  /*
  Boolean.  Whether to synthesize the target so it is subsequently seamlessly tileable.
  This is only pertinenent if isMatchContext is False (when there is no context of the target.)
  */
  int isMakeSeamlesslyTileableHorizontally;
  int isMakeSeamlesslyTileableVertically;
  /*
  Whether to synthesize the target so it matches the context of the target, if there is any.
  For the SimpleAPI, there should always be a context, otherwise, the corpus (which is the context) is empty,
  and this should be TRUE.
  For the AdvancedAPI, the target might not have a context.
  If there is no context, this is moot.
  If there is a context, set it according to whether you want the synthesize target to blend into the context.
  0 Don't match context
  1 Match context but choose corpus entirely at random
  2 Match context and synthesize randomly but in bands inward (from surrounding context.)
  3 etc. see ...orderTarget()
  */
  int matchContextType;   

  /*
  For the advanced API, when maps are passed to the engine,
  the weight to give to the matching of the maps for the target and corpus,
  as opposed to the weight  given to the matching of the target and the corpus themselves.
  Multiplication factor the the map metric.
  Scales the map metric function to return greater or lesser values
  in relation to the target/corpus metric funtion.
  */
  double mapWeight;
  
  /*
  A parameter of the statistical function for weighting pixel differences.
  AKA autism
  */
  double sensitivityToOutliers;
  
  /*
  Size of the patch matched, in pixels.
  Formerly called neighbors (but it includes the pixel being synthesized, which is not strictly a neighbor.)
  A factor in the complexity of the algorithm.
  Typically a square: 9, 16, 25, 36, 49, 64.
  But patches need not be square, indeed are NOT rectangular early in the algorithm.
  */
  unsigned int patchSize;
  
  /*
  The maximum count of probes per pixel per pass.
  Generally, this count of probes is done per pixel per pass,
  except if an exact match is found, which ends probing.
  A factor in the complexity of the algorithm.
  Typically in the hundreds.
  */
  unsigned int maxProbeCount;
} TImageSynthParameters;

typedef enum  ImageFormat 
{
  T_RGB,
  T_RGBA,
  T_Gray,
  T_GrayA
} TImageFormat;

int imageSynth(
  ImageBuffer * imageBuffer,  // IN/OUT RGBA Pixels described by imageFormat
  ImageBuffer * mask,         // IN one mask Pixelel
  TImageFormat imageFormat,
  TImageSynthParameters* parameters,
  void (*progressCallback)(int, void*),   // int percentDone, void *contextInfo
  void *contextInfo,	// opaque to engine, passed in progressCallback
  int *cancelFlag		// polled by engine: engine quits if ever becomes True
);

// Progress method for inpainting, currently unused
void progCallback(int time, void* some) {
} 

int main() {
  // Image is 227*227*4
  unsigned char img[206116];
  // Mask is 227*227
  unsigned char mask[51529];

  // Read RGB array of base image
  FILE *fp = fopen("/tmp/imgbytes", "r");
  char buff[3];
  for (int i = 0; i < 206116; i++) {
    fscanf(fp, "%s", buff);
    img[i] = atoi(buff);
  }
  fclose(fp);

  // Read 1/0 array of mask
  fp = fopen("/tmp/maskbytes", "r");
  for (int i = 0; i < 51529; i++) {
    fscanf(fp, "%s", buff);
    mask[i] = atoi(buff);
  }
  fclose(fp);

  // Create ImageBuffer for image and mask
	ImageBuffer *imgBuff = malloc(sizeof(ImageBuffer));
	imgBuff->data = img;
	imgBuff->width = 227;
	imgBuff->height = 227;
	imgBuff->rowBytes = 908;

	ImageBuffer *maskBuff = malloc(sizeof(ImageBuffer));
	maskBuff->data = mask;
	maskBuff->width = 227;
	maskBuff->height = 227;
	maskBuff->rowBytes = 227;

  // Run inpainting (Heal Selection)
	int status;
	int err = imageSynth(imgBuff, maskBuff, T_RGBA, NULL, progCallback, NULL, &status);

  // Write modified RGBA array to same file
  fp = fopen("/tmp/imgbytes", "w+");
  for (int i = 0; i < 206116; i++) {
    sprintf(buff, "%u", img[i]);
    fputs(buff, fp);
    fputc(' ', fp);
  }

  // Clean up
  fclose(fp);
  free(imgBuff);
  free(maskBuff);
	return 0;
}
