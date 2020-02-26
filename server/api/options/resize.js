module.exports = [
  {
    key: 'auto',
    name: 'Auto',
    description:
      'if both source and resulting dimensions have the same orientation (portrait or landscape), imgproxy will use fill. Otherwise, it will use fit'
  },
  {
    key: 'fit',
    name: 'Fit',
    description:
      'resizes the image while keeping aspect ratio to fit given size'
  },
  {
    key: 'fill',
    name: 'Fill',
    description:
      'resizes the image while keeping aspect ratio to fill given size and cropping projecting parts'
  }
]
