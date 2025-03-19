const images = require.context('../static/images/', false, /\.(png|jpe?g|gif|svg)$/)

export default function getImage(imageName: string) {
    try {
        if (images.keys().includes(`./${imageName}`)) {
            return images(`./${imageName}`)
        } else {
            console.warn(`Image not found: ${imageName}`)
            return null
        }
    } catch (error) {
        console.error(`Error loading image: ${imageName}`, error)
        return null
    }
}