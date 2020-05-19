const numItemsToGenerate = 48;
const team = "Acrobat";

function DocumentReady() {
  // var mainCallbacks = $.Callbacks();
  // mainCallbacks.add(initializeData);
  // mainCallbacks.add(generateCards);
  // mainCallbacks.add(setCardLayout);
  // mainCallbacks.fire();
  // TODO: NEED TO FIGURE OUT CALLBACKS
  initializeData();

  setTimeout(function () {
    generateCards(numItemsToGenerate);
  }, 200);

  setCardLayout();

  // Global header tab event handler
  transitionActiveTab();

  // Event handling for open/close filter panel
  $(".filter-button").click(function () {
    toggleFilterPanel();
  });

  $(".sidebar-filter-button").click(function () {
    toggleFilterPanel();
  });
} // End DocumentReady

// Data structure containing all template metadata used for filters, cards, etc.
var apoMetadata = {};
function initializeData() {
  // Create each array of metadata based on filters
  var filters = $(".filter-container .panel[data-type]");

  // From filters
  filters.each(function () {
    var dataType = $(this).data("type");
    createMetadataArray(dataType);
  });

  // Create metadata for cards
  createMetadataArray("card-templateName");
  createMetadataArray("card-adobeProduct");
  createMetadataArray("card-adobeTeam");
  createMetadataArray("card-lastEdited");
  createMetadataArray("card-productFlow");
  createMetadataArray("card-lastEdited");
  createMetadataArray("card-publishedInPast");
  createMetadataArray("card-receivingAudience");
  createMetadataArray("card-lastSentDate");
  createMetadataArray("card-triggerEvent");
}

// Create metadata array from text file
function createMetadataArray(dataType) {
  apoMetadata[dataType] = [];
  // read from txt file
  var filePath = "./scripts/properties/" + dataType + ".txt";
  $.ajax({
    url: filePath,
    dataType: "text",
    success: function (data) {
      apoMetadata[dataType] = data.split("\n");
    },
  }).then(function () {
    // console.log(apoMetadata[dataType]);
  });
}

function toggleFilterPanel() {
  $(".filter-container").toggle(220, $.bez([0.5, 0, 1, 1]));
  var text = $(".filter-button").text();
  $(".filter-button").text(
    text == "Hide filters" ? "Show filters" : "Hide filters"
  );
  $(".sidebar-filter-button").toggleClass("is-selected");
  $(".filter-container").toggleClass("hidden");
}

function transitionActiveTab() {
  $(".global-header nav a").click(function (event) {
    // Prevent link refresh
    event.preventDefault();

    $(".global-header nav a.active").removeClass("active");
    $(this).addClass("active");

    $(".global-header .active-underline").animate(
      {
        width: $(this).width(),
        left: $(this).position().left,
      },
      300
    );
  });
}

$(document).ready(DocumentReady);
