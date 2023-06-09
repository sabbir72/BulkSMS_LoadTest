/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 84.83870967741936, "KoPercent": 15.161290322580646};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6080645161290322, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "http://159.89.38.11/-21"], "isController": false}, {"data": [0.0, 500, 1500, "http://159.89.38.11/login/submit"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-22"], "isController": false}, {"data": [0.85, 500, 1500, "http://159.89.38.11/-20"], "isController": false}, {"data": [0.0, 500, 1500, "http://159.89.38.11/chart/data"], "isController": false}, {"data": [0.55, 500, 1500, "http://159.89.38.11/-5"], "isController": false}, {"data": [0.95, 500, 1500, "http://159.89.38.11/-6"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-7"], "isController": false}, {"data": [0.95, 500, 1500, "http://159.89.38.11/-8"], "isController": false}, {"data": [0.0, 500, 1500, "http://159.89.38.11/-9"], "isController": false}, {"data": [0.35, 500, 1500, "http://159.89.38.11/-12"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/-13"], "isController": false}, {"data": [0.4, 500, 1500, "http://159.89.38.11/-10"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "http://159.89.38.11/-0"], "isController": false}, {"data": [0.55, 500, 1500, "http://159.89.38.11/-11"], "isController": false}, {"data": [0.7, 500, 1500, "http://159.89.38.11/-1"], "isController": false}, {"data": [0.85, 500, 1500, "http://159.89.38.11/-2"], "isController": false}, {"data": [0.5, 500, 1500, "http://159.89.38.11/-3"], "isController": false}, {"data": [0.45, 500, 1500, "http://159.89.38.11/-4"], "isController": false}, {"data": [0.0, 500, 1500, "http://159.89.38.11/"], "isController": false}, {"data": [0.65, 500, 1500, "http://159.89.38.11/-18"], "isController": false}, {"data": [1.0, 500, 1500, "http://159.89.38.11/-19"], "isController": false}, {"data": [0.75, 500, 1500, "http://159.89.38.11/-16"], "isController": false}, {"data": [0.8, 500, 1500, "http://159.89.38.11/-17"], "isController": false}, {"data": [0.45, 500, 1500, "http://159.89.38.11/-14"], "isController": false}, {"data": [0.45, 500, 1500, "http://159.89.38.11/-15"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 310, 47, 15.161290322580646, 726.6225806451615, 1, 4394, 528.5, 1351.9, 1984.599999999998, 4149.3299999999945, 5.241355989517288, 563.542971061586, 7.536744309535886], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["http://159.89.38.11/-21", 10, 0, 0.0, 274.69999999999993, 268, 293, 269.5, 292.2, 293.0, 293.0, 0.1846006165660593, 0.7724742597515276, 0.16696981549168374], "isController": false}, {"data": ["http://159.89.38.11/login/submit", 10, 10, 100.0, 567.6, 546, 620, 563.0, 616.2, 620.0, 620.0, 0.18366147516896855, 0.09947134192256832, 0.08931974085365854], "isController": false}, {"data": ["http://159.89.38.11/-22", 10, 0, 0.0, 276.5, 266, 320, 271.5, 316.0, 320.0, 320.0, 0.18462447382024963, 1.2985014262240602, 0.1662702048408537], "isController": false}, {"data": ["http://159.89.38.11/-20", 10, 0, 0.0, 356.1, 267, 545, 282.5, 544.6, 545.0, 545.0, 0.18458017239788102, 8.956824967237019, 0.16839335649814496], "isController": false}, {"data": ["http://159.89.38.11/chart/data", 10, 10, 100.0, 375.50000000000006, 307, 910, 314.0, 852.4000000000002, 910.0, 910.0, 0.18414171546422126, 0.09973144081685266, 0.17590568951865357], "isController": false}, {"data": ["http://159.89.38.11/-5", 10, 0, 0.0, 514.5, 271, 574, 536.5, 571.2, 574.0, 574.0, 0.184362382699434, 0.5131179596615106, 0.17269570066923545], "isController": false}, {"data": ["http://159.89.38.11/-6", 10, 0, 0.0, 381.4, 239, 1436, 263.5, 1322.8000000000004, 1436.0, 1436.0, 0.1852846899260714, 22.05412542152267, 0.07599567360249024], "isController": false}, {"data": ["http://159.89.38.11/-7", 10, 0, 0.0, 26.200000000000003, 18, 44, 23.5, 43.0, 44.0, 44.0, 0.1861365497729134, 2.9290512910896433, 0.07652684321718413], "isController": false}, {"data": ["http://159.89.38.11/-8", 10, 0, 0.0, 276.3, 172, 1038, 192.0, 955.2000000000003, 1038.0, 1038.0, 0.18644889435805645, 4.34717250251706, 0.07720149532013275], "isController": false}, {"data": ["http://159.89.38.11/-9", 10, 9, 90.0, 1367.2000000000003, 1032, 2988, 1186.0, 2828.9000000000005, 2988.0, 2988.0, 0.18327773908581066, 93.23200771026539, 0.18462010533888054], "isController": false}, {"data": ["http://159.89.38.11/-12", 10, 0, 0.0, 1560.0, 547, 3252, 1168.0, 3251.2, 3252.0, 3252.0, 0.17657861279841786, 15.24611471871027, 0.1623005765291708], "isController": false}, {"data": ["http://159.89.38.11/-13", 10, 0, 0.0, 1115.6000000000001, 286, 2077, 1098.0, 1984.8000000000002, 2077.0, 2077.0, 0.18239521394958597, 7.865793601575895, 0.16515316638091415], "isController": false}, {"data": ["http://159.89.38.11/-10", 10, 0, 0.0, 1325.6, 987, 1909, 1288.5, 1878.7, 1909.0, 1909.0, 0.182768578425997, 9.59999097580144, 0.3200591941733377], "isController": false}, {"data": ["http://159.89.38.11/-0", 30, 0, 0.0, 867.5666666666667, 295, 2170, 951.0, 1385.1000000000001, 1893.3499999999997, 2170.0, 0.538000789067824, 95.20845148802051, 0.4387018153043291], "isController": false}, {"data": ["http://159.89.38.11/-11", 10, 0, 0.0, 1009.6999999999999, 278, 1136, 1072.5, 1134.5, 1136.0, 1136.0, 0.18433519511880403, 7.623088386421869, 0.16762981806116242], "isController": false}, {"data": ["http://159.89.38.11/-1", 30, 9, 30.0, 203.73333333333332, 1, 499, 264.5, 328.9000000000001, 430.7999999999999, 499.0, 0.5389673385792821, 4.658295409121124, 0.2540971342657468], "isController": false}, {"data": ["http://159.89.38.11/-2", 20, 0, 0.0, 337.7, 196, 548, 274.5, 543.7, 547.85, 548.0, 0.3619778469557663, 3.392481833236806, 0.23846704644175776], "isController": false}, {"data": ["http://159.89.38.11/-3", 10, 0, 0.0, 795.3, 520, 1288, 832.5, 1276.3, 1288.0, 1288.0, 0.1822124232430167, 6.062833676500063, 0.16925825877808348], "isController": false}, {"data": ["http://159.89.38.11/-4", 10, 0, 0.0, 915.5000000000001, 773, 1609, 806.5, 1545.4, 1609.0, 1609.0, 0.1807795212958276, 2.9221314809458385, 0.16457291967965867], "isController": false}, {"data": ["http://159.89.38.11/", 10, 9, 90.0, 3540.2000000000003, 2917, 4394, 3330.0, 4391.5, 4394.0, 4394.0, 0.17185083347654237, 238.0798958691356, 3.4693226123474825], "isController": false}, {"data": ["http://159.89.38.11/-18", 10, 0, 0.0, 547.6, 280, 1107, 538.5, 1076.1000000000001, 1107.0, 1107.0, 0.18417902200939315, 15.186135924118242, 0.17036559535868864], "isController": false}, {"data": ["http://159.89.38.11/-19", 10, 0, 0.0, 277.6, 268, 309, 274.0, 306.5, 309.0, 309.0, 0.18373909049150208, 3.646969740468535, 0.16601113918236104], "isController": false}, {"data": ["http://159.89.38.11/-16", 10, 0, 0.0, 514.4, 265, 811, 421.5, 810.7, 811.0, 811.0, 0.1829123301201734, 3.31510735810576, 0.17205191051928811], "isController": false}, {"data": ["http://159.89.38.11/-17", 10, 0, 0.0, 526.3000000000001, 264, 1054, 288.5, 1036.1000000000001, 1054.0, 1054.0, 0.18324751241501896, 4.361255004947683, 0.1709355701746349], "isController": false}, {"data": ["http://159.89.38.11/-14", 10, 0, 0.0, 1303.4, 805, 1904, 1351.5, 1854.7000000000003, 1904.0, 1904.0, 0.18346267451886913, 27.091381324875705, 0.16701553240868147], "isController": false}, {"data": ["http://159.89.38.11/-15", 10, 0, 0.0, 788.7999999999998, 527, 1897, 569.5, 1811.6000000000004, 1897.0, 1897.0, 0.18441338103492788, 14.209915446464796, 0.1723832893814775], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 159.89.38.11:80 failed to respond", 9, 19.148936170212767, 2.903225806451613], "isController": false}, {"data": ["419/unknown status", 20, 42.5531914893617, 6.451612903225806], "isController": false}, {"data": ["Assertion failed", 18, 38.297872340425535, 5.806451612903226], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 310, 47, "419/unknown status", 20, "Assertion failed", 18, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 159.89.38.11:80 failed to respond", 9, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["http://159.89.38.11/login/submit", 10, 10, "419/unknown status", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://159.89.38.11/chart/data", 10, 10, "419/unknown status", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://159.89.38.11/-9", 10, 9, "Assertion failed", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://159.89.38.11/-1", 30, 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: 159.89.38.11:80 failed to respond", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["http://159.89.38.11/", 10, 9, "Assertion failed", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
