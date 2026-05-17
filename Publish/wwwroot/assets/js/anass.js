import * as arab from 'src/assets/js/Translate/ar.json'
var ar=arab
const arTranslations = this.ar;
    const tags = ['a', 'span', 'h1', 'h2', 'h3', 'h4', 'li', 'button']; // List of tags to target

    tags.forEach(tag => {
      // Get all elements for the current tag
      const elements = document.getElementsByTagName(tag);

      // Iterate over each element
      Array.from(elements).forEach((element: Element) => {
        // Cast element to HTMLElement to access innerText
        const htmlElement = element as HTMLElement;

        // Iterate over translation keys
        Object.keys(arTranslations).forEach(key => {
          // Check if the element's inner text matches the key

          console.log(htmlElement.innerHTML);
          if (htmlElement.innerText.trim().toUpperCase() === key.toUpperCase()) {
            // Replace the inner text with the corresponding Arabic translation
            htmlElement.innerText = arTranslations[key];
            // console.log(key, htmlElement.innerText);
          }
        });
      });
    });
