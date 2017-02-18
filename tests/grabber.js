var _ = require('underscore');
require('console2')();

let result = {};
let endPagination = false;

function setDataType(entity, type) {
  if (result[entity] == undefined) {
    result[entity] = {};
    result[entity]['type'] = '';
    result[entity]['contact'] = '';
    result[entity]['site'] = '';
  }
  // Add library for setting key-value without error
  result[entity]['type'] = type;
}

function setDataContact(entity, contact) {
  // if (result[entity]['contact'] == undefined) {
  //   result[entity]['contact'] = '';
  // }
  // Add library for setting key-value without error
  result[entity]["contact"] = contact;
}

function setDataSite(entity, site) {
  // if (result[entity]['site'] == undefined) {
  //   result[entity]['site'] = '';
  // }
  // Add library for setting key-value without error
  result[entity]['site'] = site;
}

module.exports = {
  'Selecting Clinical Study Site': function(browser) {
    const URL = 'http://www.rnec.pt/pesquisa-de-entidades';
    const SEARCH_BUTTON = '#_RNECPesquisaEntidade_WAR_RNECPesquisaEntidadeportlet_ > form > .ui-outputpanel.ui-widget > fieldset > .ui-fieldset-content > table .ui-panelgrid-cell.rnecButtonBar > button';
    const DROP_DOWN = '#_RNECPesquisaEntidade_WAR_RNECPesquisaEntidadeportlet_ > form > .ui-outputpanel.ui-widget > fieldset > .ui-fieldset-content > table .ui-selectonemenu.ui-widget.ui-state-default.ui-corner-all.full-width';
    const PAGINATOR = '.ui-paginator-pages';
    const PAGINATOR_NEXT = '.ui-paginator.ui-paginator-top.ui-widget-header.ui-corner-top > span:nth-child(5)';
    const DROP_DOWN_VALUES = '.ui-selectonemenu-items-wrapper > ul > li:nth-child(4)';
    const TABLE_ROWS = '.ui-datatable-tablewrapper > table > tbody > tr';
    const ADDITIONAL_STUDY_INFO = 'div[id="_RNECPesquisaEntidade_WAR_RNECPesquisaEntidadeportlet_\\3a j_idt6\\3a details"]';
    const CONTACT = 'fieldset[id="_RNECPesquisaEntidade_WAR_RNECPesquisaEntidadeportlet_\\3a j_idt6\\3a j_idt41"] > div';
    const SITE = 'fieldset[id="_RNECPesquisaEntidade_WAR_RNECPesquisaEntidadeportlet_\\3a j_idt6\\3a j_idt65"] > div';
    const TIMEOUT = 10000;

    browser
      .url(URL)
      .waitForElementVisible(SEARCH_BUTTON, TIMEOUT)
      .click(DROP_DOWN)
      .elements('css selector', DROP_DOWN_VALUES, function(res) {
        if (res.value.length != 0) {
          browser.elementIdText(res.value[0].ELEMENT, function(filter) {
            console.info('Option selected ==> ', filter.value);
          });
          browser.elementIdClick(res.value[0].ELEMENT);
        } else {
          console.error('No elements available in selector!');
        }
      })
      .click(SEARCH_BUTTON)
      .waitForElementVisible(PAGINATOR, TIMEOUT)
      .execute(function() {}, [], function(response) {
        browser.getAttribute(PAGINATOR_NEXT, "class", function(classValue) {
          endPagination = _.includes(classValue, 'disabled');
        });
      })
      .waitUntil(function(callback) {
          browser
            .elements('css selector', TABLE_ROWS, function(rows) {
              // console.log(rows);
              _.each(rows.value, function(row) {
                console.log(row);
                let element = row.ELEMENT;
                let entity = undefined;

                browser
                  .elementIdClick(element)
                  // .pause(500)
                  // .waitForElementVisible(ADDITIONAL_STUDY_INFO, 10000)
                  .elementIdText(element, function(rowText) {
                    console.log(rowText);
                    let arr = rowText.value.split('\n');
                    entity = arr[0];
                    let type = _.rest(arr);
                    setDataType(entity, type);
                    // console.log(element, entity);
                    console.log('Data set');
                  });
                // .getAttribute(ADDITIONAL_STUDY_INFO, "id", function(x) {
                //   console.log(x);
                // })
                // .getText(CONTACT, function(contact) {
                //   console.log(entity);
                //   //setDataContact(entity, type);
                //   // console.log(contact);
                // })
                // .getText(SITE, function(site) {
                //   //setDataContact(entity, type);
                //   // console.log(site);
                //   console.log(entity);
                // });

              });
            })
            .click(PAGINATOR_NEXT)
            .pause(500)
            .getAttribute(PAGINATOR_NEXT, 'class', function(classValue) {
              endPagination = _.includes(classValue, 'disabled');
              callback(endPagination);
            });
        }, function(paginationFinish) {
          return paginationFinish;
        }, function() {},
        TIMEOUT, 'waitUntil failed')
      .end();



    // .elements('css selector', TABLE_ROWS, function(rows) {
    //   console.log(rows);
    // Check end of paginator
    // .execute(function() {}, [], function(response) {
    //   let endPagination = false;
    //   console.log('###############');

    // while (!endPagination) {
    // browser.waitUntil(function() {
    //   _.each(rows.value, function(row) {
    //     console.log('EACH');
    //     // // Entity
    //     // browser.elementIdElement(row.ELEMENT, 'css selector', 'td:nth-child(1)', function(rowText) {
    //     //   browser.elementIdText(rowText.value.ELEMENT, function(rowText) {
    //     //     entity = rowText.value;
    //     //     randomString(entity, '');
    //     //   });
    //     // });

    //     // // Type
    //     // browser.elementIdElement(row.ELEMENT, 'css selector', 'td:nth-child(2)', function(rowText) {
    //     //   return browser.elementIdText(rowText.value.ELEMENT, function(rowText) {
    //     //     var type = rowText.value;
    //     //     console.log(entity, type)
    //     //   });
    //     // });
    //     // ui-paginator-next ui-state-default ui-corner-all ui-state-disabled
    //     return browser
    //       .elementIdText(row.ELEMENT, function(rowText) {
    //         let arr = rowText.value.split("\n");
    //         let entity = arr[0];
    //         let type = _.rest(arr);
    //         setData(entity, type);
    //         console.log('Data set');
    //       })
    //       .click(PAGINATOR_NEXT)
    //       .getAttribute(PAGINATOR_NEXT, "class", function(classValue) {
    //         endPagination = _.includes(classValue, 'disabled');
    //         return endPagination;
    //         //console.log(endPagination);
    //       });
    //   });

    // }, function(pagination) {
    //   console.log(pagination);
    //   return pagination == true;
    // }, function(val) {
    //   console.log('assertion');
    // }, 5000, 'waitUntil failed');

    // }
    // });
    // })
  },
  'Exporting data': function(browser) {
    // console.log(result);
    browser.end();
  }
};
