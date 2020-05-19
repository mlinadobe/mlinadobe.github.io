function DocumentReady() {}
var generateCardsCallbacks = $.Callbacks();

function generateCards(numOfCards) {
  $(".card-view").empty();
  for (i = 0; i < numOfCards; i++) {
    createCard(i);
  }
}

function createCard(index) {
  // Select element to insert template
  var content = $(".card-view");
  // Select template
  var template = document.querySelector("#template-card");
  // Clone template and edit its content
  // ** MUST USE JS functions for clone - not jquery
  var clone = template.content.cloneNode(true);
  var spectrumCard = clone.querySelector(".spectrum-Card");

  // *** Set template name USING CARD METADATA ARRAY
  // set card labels for UI also
  setCardDataTypes(
    spectrumCard,
    "card-templateName",
    index,
    true,
    ".spectrum-Card-title h6"
  );

  // *** Set Adobe team USING CARD METADATA ARRAY
  setCardDataTypes(spectrumCard, "card-adobeTeam", index);

  // *** Set Adobe Product USING CARD METADATA ARRAY
  setCardDataTypes(spectrumCard, "card-adobeProduct", index);

  // *** Set Product flow USING CARD METADATA ARRAY
  setCardDataTypes(spectrumCard, "card-productFlow", index);

  // *** Set Trigger event USING CARD METADATA ARRAY
  setCardDataTypes(spectrumCard, "card-triggerEvent", index);

  // *** Set Last sent date USING CARD METADATA ARRAY
  setCardDataTypes(
    spectrumCard,
    "card-lastSentDate",
    index,
    true,
    ".spectrum-Card-content span.sent-date"
  );

  // *** Set Last edited USING CARD METADATA ARRAY
  setCardDataTypes(spectrumCard, "card-lastEdited", index);

  // *** Set Published in past USING CARD METADATA ARRAY
  setCardDataTypes(spectrumCard, "card-publishedInPast", index);

  // *** Set Receiving audience USING CARD METADATA ARRAY
  setCardDataTypes(spectrumCard, "card-receivingAudience", index);

  // *** Set Created by
  setCardDataTypesByRandom(spectrumCard, "createdBy");

  // *** Set Language
  setCardDataTypesByRandom(spectrumCard, "language");

  // *** Set Trigger system
  apoMetadata["triggerSystem"] = shuffle(apoMetadata["triggerSystem"]);
  var triggerSystem =
    apoMetadata["triggerSystem"][
      randomNumber(apoMetadata["triggerSystem"].length)
    ];
  spectrumCard.setAttribute("data-triggersystem", triggerSystem);

  // *** Set Publishing environment
  apoMetadata["publishEnvironment"] = shuffle(
    apoMetadata["publishEnvironment"]
  );
  var publishEnvironment =
    apoMetadata["publishEnvironment"][
      randomNumber(apoMetadata["publishEnvironment"].length)
    ];
  spectrumCard.setAttribute("data-publishenvironment", publishEnvironment);
  spectrumCard.querySelector(
    ".spectrum-Card-content span.publish-environment"
  ).textContent = publishEnvironment;

  // *** Set Cover photo
  if (index != 0) {
    var query = "wallpaper";
    fetch("https://source.unsplash.com/random?" + i + "/&" + query).then(
      function (response) {
        // console.log(response.url);
        var coverPhoto = spectrumCard.querySelector(
          ".spectrum-Card-coverPhoto"
        );
        coverPhoto.style.backgroundImage = "url(" + response.url + ")";
      }
    );
  }

  // Append to DOM
  content.append(clone);
  //
  setFirstCardTemplate(index);
  // animation
  setTimeout(function () {
    content.find(".spectrum-Card").fadeIn(300);
  }, 500);
}

function setFirstCardTemplate(index) {
  if (index == 0) {
    // console.log($(".spectrum-Card").html());
    $(".spectrum-Card")
      .first()
      .find(".spectrum-Card-coverPhoto")
      .css("background-image", "url(images/template-email.png)")
      .css("background-position", "top");
  }
}

function setCardDataTypes(spectrumCard, metadataName, index, setLabel, query) {
  // Assigns card metadata from card data type arrays in linear fashion
  // for associated data types that must be in order.
  // Modify metadataName to have same data attribute name as filters
  var datatypeAttributeName = metadataName.toLowerCase().replace(/card-/gi, "");

  var dataAttribute = "data-" + datatypeAttributeName;
  // console.log("card data attribute: " + dataAttribute);
  // finds random value in array
  var metadataValue = apoMetadata[metadataName][index];
  // console.log(metadataName + " > " + metadataValue);
  spectrumCard.setAttribute(dataAttribute, metadataValue);

  if (setLabel) {
    spectrumCard.querySelector(query).textContent = metadataValue;
  }
}

function setCardDataTypesByRandom(spectrumCard, metadataName) {
  // Assigns metadata from data type arrays to card in random order
  // Set lowercase to for data attribute name
  var datatypeAttributeName = metadataName.toLowerCase();
  var dataAttribute = "data-" + datatypeAttributeName;
  // finds random value in array
  var metadataValue =
    apoMetadata[metadataName][randomNumber(apoMetadata[metadataName].length)];

  spectrumCard.setAttribute(dataAttribute, metadataValue);
}

function removeUnderscore(phrase) {
  return phrase.replace(/_/g, " ");
}

function randomNumber(size) {
  return Math.floor(Math.random() * size);
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/* Calculates the card view to use flex layout to 
left-align few cards and grid view for lots of cards  */
function setCardLayout() {
  setTimeout(function () {
    var numItems = $(".spectrum-Card").length;
    console.log("num of cards: " + numItems);
    $(".card-view").addClass("grid");

    if (numItems >= 4) {
      $(".card-view").addClass("grid");
    } else {
      $(".card-view").removeClass("grid");
    }
  }, 600);
}

// function getRandomImageUrl() {
//   var query = "wallpaper";
//   fetch("https://source.unsplash.com/random?" + i + "/&" + query).then(
//     function (response) {
//       console.log(response.url);
//       return response.url;
//     }
//   );
// }

$(document).ready(DocumentReady);
