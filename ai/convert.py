from PIL import Image

# Open the JPG image
jpg_image = Image.open('headphone_drawing.jpg')

# Convert to PNG and save
jpg_image.save('headphone_drawing.png', 'PNG')
