import "./style.css"
import craftXIconSrc from "./craftx-icon.png"
import {textContent} from "./utils";

craft.env.setListener((env) => {
  switch (env.colorScheme) {
    case "dark":
      document.body.classList.add("dark");
      break;
    case "light":
      document.body.classList.remove("dark");
      break;
  }
})

window.addEventListener("load", () => {
  const button = document.getElementById('btn-execute');

  button?.addEventListener("click", async () => {

    const response = await craft.editorApi.getSelection();
    const dataBlock = response.data!;
    const currentPage = await craft.dataApi.getCurrentPage();
    const dataText = textContent(dataBlock[0]);

    const theData = {
      "source": "IAST",
      "target": "Itrans",
      "text": dataText,
      "nativize": true,
      "postOptions": [],
      "preOptions": []
    };
    const settings = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(theData)
    };
    const response2 = await fetch('http://localhost:8085/api/convert', settings);
    const response2Data = await response2.text();
    const response3 = response2Data.replace(/<br\/>/g,"\n");

    // craft.editorApi.openURL('http://localhost:8085');

    const block = craft.blockFactory.textBlock({
      content: response3
    });

    const currentPageId = currentPage.data?.id!;
    const location = craft.location.afterBlockLocation(currentPageId, dataBlock[0].id);
    craft.dataApi.addBlocks([block], location);
  })
  const logoImg = document.getElementById('craftx-logo') as HTMLImageElement
  logoImg.src = craftXIconSrc;
})
