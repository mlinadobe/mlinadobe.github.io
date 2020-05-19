var filterOpenDuration = 160;
var activeFilters = [];

function DocumentReady() {
  // Resizes autocomplete dropdown to width of comboBox
  jQuery.ui.autocomplete.prototype._resizeMenu = function () {
    var ul = this.menu.element;
    ul.outerWidth(this.element.outerWidth() + 34);
  };

  // Toggle expand all/close filter panels
  $(".filter-container .panel .expand-all").click(function () {
    if (!$(this).hasClass("is-selected")) {
      // open all filters without open class
      $(this).addClass("is-selected");
      $(".filter-container .panel.filter")
        .not(".open")
        .find(".content")
        .slideToggle(filterOpenDuration, $.bez([0.5, 0, 1, 1]));
      $(".filter-container .panel.filter").addClass("open");
    } else {
      // close all filters with open class
      $(this).removeClass("is-selected");
      $(".filter-container .panel.filter.open .content").slideToggle(
        filterOpenDuration,
        $.bez([0.5, 0, 1, 1])
      );
      $(".filter-container .panel.filter").removeClass("open");
    }
  });

  // Toggle open/close individual filter panel
  $(".filter-container .panel.filter .header").click(function () {
    $(this).parent().toggleClass("open");

    $(this)
      .parent()
      .find(".content")
      .slideToggle(filterOpenDuration, $.bez([0.5, 0, 1, 1]));

    // $(this).parent().find(".content").find(".description").fadeToggle(200);

    checkExpandAllSelected();
  });

  // Published in past drop-down event listener
  $(
    ".filter-container .panel.filter[data-type=publishedInPast] .spectrum-Menu-item"
  ).click(function () {
    var previousValue = $(
      ".filter-container .panel.filter[data-type=publishedInPast] .spectrum-Dropdown-label"
    ).text();
    var selectedValue = $(this).find(".spectrum-Menu-itemLabel").text();
    var datatype = "publishedInPast";

    // Remove previous value from array
    var dataAttribute = "[data-" + datatype + "='" + previousValue + "']";
    var position = activeFilters.indexOf(dataAttribute);
    if (~position) {
      // console.log("Remove: " + dataAttribute);
      activeFilters.splice(position, 1);
      refreshResults();
    }

    // Add to active filters array
    // Don't add if it's Anytime since that shows all cards
    if (selectedValue != "Anytime") {
      // console.log("Adding: " + selectedValue);
      var dataAttribute = "[data-" + datatype + "='" + selectedValue + "']";
      activeFilters.push(dataAttribute);
      refreshResults();
    }
  });

  // My team only toggle event listener
  $(".content-container .my-team-only-toggle input").click(function () {
    var content = $(
      ".filter-container .panel.filter[data-type=adobeTeam] .content"
    );
    // console.log("check toggle: " + $(this).is(":checked"));
    // console.log(
    //   "found tag: " +
    //     ($(".tag-wrapper .spectrum-Tags-itemLabel").text() == team)
    // );

    // If enabled and team tag not set, open Adobe Teams filter panel and add team tag
    if (
      $(this).is(":checked") &&
      $(".tag-wrapper .spectrum-Tags-itemLabel").text() != team
    ) {
      content.slideDown(filterOpenDuration, $.bez([0.5, 0, 1, 1]));

      // Add team tag
      // Select HTML tag template element
      var template = document.querySelector("#template-tag");
      // clone HTML tag template and set its content value
      var clone = template.content.cloneNode(true);
      var selectedTagValue = team;
      clone.querySelector(
        ".spectrum-Tags-itemLabel"
      ).textContent = selectedTagValue;

      // Append tag to filter panel's content element
      content.append(clone);

      // Remove value from dropdown
      var datatype = content.parents(".panel.filter").data("type");
      apoMetadata[datatype] = removeItemFromArray(
        apoMetadata[datatype],
        selectedTagValue
      );

      // setup data attribute for this tag to remove from active filters array
      var dataAttribute = "[data-" + datatype + "='" + selectedTagValue + "']";
      // Add to active filters array
      activeFilters.push(dataAttribute);
      refreshResults();
    } else if (
      // if disabled and tag is already added, then remove tag
      !$(this).is(":checked") &&
      $(".tag-wrapper .spectrum-Tags-itemLabel").text() == team
    ) {
      // find tag with team
      var tag = $(
        ".tag-wrapper .spectrum-Tags-itemLabel:contains('" + team + "')"
      );
      tag = tag.parents(".tag-wrapper");
      var removedItem = team;
      var datatype = tag.parents(".panel.filter").data("type");

      tag.fadeOut(260, function () {
        tag.remove();
      });

      // Add item back to dropdown
      apoMetadata[datatype].push(removedItem);

      // remove from active filters array
      var dataAttribute = "[data-" + datatype + "='" + removedItem + "']";
      var position = activeFilters.indexOf(dataAttribute);
      if (~position) activeFilters.splice(position, 1);

      refreshResults();
    }
  });

  // Publishing Environment Listener
  $(
    ".filter-container .panel.filter[data-type=publishEnvironment] input"
  ).click(function () {
    console.log(
      "Type: " +
        $(this).siblings(".spectrum-Checkbox-label").text() +
        " " +
        $(this).is(":checked")
    );
    var selectedValue = $(this).siblings(".spectrum-Checkbox-label").text();
    var dataAttribute =
      "[data-" + "publishEnvironment" + "='" + selectedValue + "']";

    if ($(this).is(":checked")) {
      // Add to active filters array
      activeFilters.push(dataAttribute);
      refreshResults();
    } else if (!$(this).is(":checked")) {
      var position = activeFilters.indexOf(dataAttribute);
      if (~position) activeFilters.splice(position, 1);
      refreshResults();
    }
  });

  // Filter combo-box is populated from text file
  $(".filter-container .panel.filter .combo-box input").click(function () {
    showComboBoxDropdownSearch($(this), false);
  });

  $(".filter-container .panel.filter .combo-box button").click(function () {
    showComboBoxDropdownSearch($(this), true);
  });

  // Add tags from comboBox based on filter selection
  $(".filter-container .panel.filter .combo-box input").on(
    "autocompleteselect",
    function (e, ui) {
      // Element to insert HTML tag template at
      var content = $(this).parents(".content");
      // Select HTML tag template element
      var template = document.querySelector("#template-tag");
      // clone HTML tag template and set its content value
      var clone = template.content.cloneNode(true);
      var selectedTagValue = ui.item.value;
      clone.querySelector(
        ".spectrum-Tags-itemLabel"
      ).textContent = selectedTagValue;

      // Append tag to filter panel's content element
      content.append(clone);

      // Remove value from dropdown
      var datatype = $(this).parents(".panel.filter").data("type");

      apoMetadata[datatype] = removeItemFromArray(
        apoMetadata[datatype],
        selectedTagValue
      );

      // Add to active filters array
      var dataAttribute = "[data-" + datatype + "='" + selectedTagValue + "']";
      activeFilters.push(dataAttribute);
      refreshResults();
    }
  );

  function refreshResults() {
    $(".spectrum-Card").fadeOut();
    if (activeFilters === undefined || activeFilters.length == 0) {
      $(".spectrum-Card").fadeIn();
    } else {
      for (index = 0; index < activeFilters.length; index++) {
        // console.log(activeFilters[index]);
        $(".spectrum-Card" + activeFilters[index]).fadeIn();
      }
    }

    setCardLayout();
  }

  function printArray(item, index) {
    console.log("index: " + index + " item: " + item);
  }

  // Remove tags from comboBox
  $(".filter-container .panel.filter .content").on(
    "click",
    // this is the selection - need to add delegate appended elements to work
    ".tag-wrapper .spectrum-ClearButton",
    function () {
      var tag = $(this).parents(".tag-wrapper");
      var removedItem = tag.find(".spectrum-Tags-itemLabel").text();
      var datatype = $(this).parents(".panel.filter").data("type");

      tag.fadeOut(260, function () {
        tag.remove();
      });

      // Add item back to dropdown
      apoMetadata[datatype].push(removedItem);

      // remove from active filters array
      var dataAttribute = "[data-" + datatype + "='" + removedItem + "']";
      var position = activeFilters.indexOf(dataAttribute);
      if (~position) activeFilters.splice(position, 1);

      refreshResults();
    }
  );

  // Style combo-box focus
  $(".filter-container .panel .combo-box")
    .children()
    .focus(function () {
      $(this).addClass("focus");
      $(this).siblings().addClass("focus");
    });

  $(".filter-container .panel .combo-box")
    .children()
    .focusout(function () {
      $(this).removeClass("focus");
      $(this).siblings().removeClass("focus");
    });

  // Style combo-box hover
  $(".filter-container .panel .combo-box")
    .children()
    .hover(
      function () {
        if (!$(this).siblings().hasClass("focus")) {
          $(this).addClass("hover");
          $(this).siblings().addClass("hover");
        }
      },
      function () {
        if (!$(this).siblings().hasClass("focus")) {
          $(this).removeClass("hover");
          $(this).siblings().removeClass("hover");
        }
      }
    );
} // end DocumentReady

function removeItemFromArray(array, removeItem) {
  array = $.grep(array, function (value) {
    return value != removeItem;
  });
  return array;
}

function showComboBoxDropdownSearch(comboBoxComponent, isDropdownButton) {
  var comboBox = comboBoxComponent.parent();
  var dataType = comboBoxComponent.parents(".panel.filter").data("type");
  var comboBoxInput = comboBox.find("input");
  var minCharSearch = 1; // minimum character to start search
  // console.log("filter: " + dataType);
  // ComboBox dropdown button
  if (isDropdownButton) {
    // 0 characters to start autocomplete search to show dropdown
    minCharSearch = 0;
  }

  comboBoxInput.autocomplete({
    // populate autocomplete drop-down
    source: apoMetadata[dataType].sort(),
    // search after min characters entered in input
    minLength: minCharSearch,
    // drop-down position
    position: {
      my: "left top",
      at: "left bottom+4",
      collision: "none",
    },
    select: function () {
      // Clear combo-box input after selection
      $(this).val("");
      return false;
    },
  });
  if (isDropdownButton) {
    // TODO: Toggle close menu if open
    // console.log($(".ui-menu").is(":visible"));
    // show drop-down after menu load
    comboBoxInput.autocomplete("search");
  }
}

// sets state of expand-all filters button
function checkExpandAllSelected() {
  // if all filters are expanded the set selected state
  if ($(".filter-container .panel.filter").not(".open").length == 0) {
    $(".filter-container .panel .expand-all").addClass("is-selected");
  } else if ($(".filter-container .panel.filter.open").length > 0) {
    // if any filter is collapsed
    $(".filter-container .panel .expand-all").removeClass("is-selected");
  }
}

$(document).ready(DocumentReady);
