
var fill = d3.scale.category20b();
var width = 960;
var height = 600;
var words = [];
var max = 250;
var scale = 1;
var complete = 0;
var keyword = "";
var fontSize;
var maxLength = 30;
var fetcher;

var unicodePunctuationRe = "!-#%-*,-/:;?@\\[-\\]_{}\xa1\xa7\xab\xb6\xb7\xbb\xbf\u037e\u0387\u055a-\u055f\u0589\u058a\u05be\u05c0\u05c3\u05c6\u05f3\u05f4\u0609\u060a\u060c\u060d\u061b\u061e\u061f\u066a-\u066d\u06d4\u0700-\u070d\u07f7-\u07f9\u0830-\u083e\u085e\u0964\u0965\u0970\u0af0\u0df4\u0e4f\u0e5a\u0e5b\u0f04-\u0f12\u0f14\u0f3a-\u0f3d\u0f85\u0fd0-\u0fd4\u0fd9\u0fda\u104a-\u104f\u10fb\u1360-\u1368\u1400\u166d\u166e\u169b\u169c\u16eb-\u16ed\u1735\u1736\u17d4-\u17d6\u17d8-\u17da\u1800-\u180a\u1944\u1945\u1a1e\u1a1f\u1aa0-\u1aa6\u1aa8-\u1aad\u1b5a-\u1b60\u1bfc-\u1bff\u1c3b-\u1c3f\u1c7e\u1c7f\u1cc0-\u1cc7\u1cd3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205e\u207d\u207e\u208d\u208e\u2329\u232a\u2768-\u2775\u27c5\u27c6\u27e6-\u27ef\u2983-\u2998\u29d8-\u29db\u29fc\u29fd\u2cf9-\u2cfc\u2cfe\u2cff\u2d70\u2e00-\u2e2e\u2e30-\u2e3b\u3001-\u3003\u3008-\u3011\u3014-\u301f\u3030\u303d\u30a0\u30fb\ua4fe\ua4ff\ua60d-\ua60f\ua673\ua67e\ua6f2-\ua6f7\ua874-\ua877\ua8ce\ua8cf\ua8f8-\ua8fa\ua92e\ua92f\ua95f\ua9c1-\ua9cd\ua9de\ua9df\uaa5c-\uaa5f\uaade\uaadf\uaaf0\uaaf1\uabeb\ufd3e\ufd3f\ufe10-\ufe19\ufe30-\ufe52\ufe54-\ufe61\ufe63\ufe68\ufe6a\ufe6b\uff01-\uff03\uff05-\uff0a\uff0c-\uff0f\uff1a\uff1b\uff1f\uff20\uff3b-\uff3d\uff3f\uff5b\uff5d\uff5f-\uff65";
var stopWords = /^(i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall|ied|ieds|found|kg|gr|alone|cache|discovered|2|3|suspect|trying|near|man|near|inside|road|affected|close|km|military)$/;
var punctuation = new RegExp("[" + unicodePunctuationRe + "]", "g");
var wordSeparators = /[ \f\n\r\t\v\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000\u3031-\u3035\u309b\u309c\u30a0\u30fc\uff70]+/g;
var discard = /^(@|https?:|\/\/)/;

var svg = d3.select("#text-vis").append("svg").attr("width", width).attr("height", height);
//var background = svg.append("g");
//var vis = svg.append("g").attr("transform", "translate(" + [width/2, height/2] + ")");

var ied_text;
var incidents = [];






//var layout = d3.layout.cloud()
//    .timeInterval(10)
//    .size([width, height])
//    .fontSize(function(t) {
//        return fontSize(+t.value)
//    }).font("Impact")
//        .spiral("archimedean")
//    .text(function(t) {
//        return t.key
//    }).on("end", draw);


d3.csv("data/ied_text.csv", function(error, data) {
    //console.log(data);
    ied_text = data;

    //var corpus = ied_text.map(function(d){ return d.text;}).join(' ');
    //console.log(corpus);

    var byType = d3.nest()
        .key(function(d) { return d.type; })
        .entries(data);
    console.log(byType);

    var byTypeRollup = d3.nest()
        .key(function(d) { return d.type; })
        .rollup(function(leaves) {
            return {
                length: leaves.length,
                kia: d3.sum(leaves, function(d) {
                    return parseInt(d.kia);
                }),
                wia: d3.sum(leaves, function(d) {
                    return parseInt(d.wia);
                })
            }
        })
        .entries(data);
    console.log(byTypeRollup);

    //var corpus = byType[0].values.map(function(d){ return d.text;}).join(' ');

    //var tags = parseText(corpus);
    //generate(tags,50);
    var w = width/4;
    var h = height/3-10;
    for(var i=0;i<byType.length;i++){

        var wc = svg.append("g");
        var background = wc.append("g");

        //wc.append("text");
        var centerX = w/2 + w*(i%4);
        var centerY = h/2+ h*(i%3);
        var vis = wc.append("g").attr("transform", "translate(" + [centerX,  centerY] + ")");

        var title = wc.append("text").text(byType[i].key);
        title.attr("transform", "translate(" + [centerX-40,  centerY+90] + ")");

        var wcChart = new WordCloudChart(vis,byType[i],w,h,25,centerX,centerY);
    }



});

WordCloudChart = function(_parentGroup, _data,_width,_height,_maxWords,_centerX,_centerY){
	this.parentGroup = _parentGroup;
	this.data = _data;
    this.width = _width;
    this.height = _height;
    this.centerX = _centerX;
    this.centerY = _centerY;
    this.maxWords = _maxWords;

	// DEBUG RAW DATA
	console.log(this.data);

	this.initVis();
}

WordCloudChart.prototype.initVis = function() {
    var vis = this;

    function parseText(allwords) {
        var tags = {};
        var tag_index = {};
        // Split all words into individual words and remove unwanted characters
        allwords.split(wordSeparators)
            .forEach(function(word) {
                if (!discard.test(word)) {
                    word = word.replace(punctuation, "");
                    if (!stopWords.test(word.toLowerCase())) {
                        word = word.substr(0, maxLength);
                        tag_index[word.toLowerCase()] = word;
                        word = word.toLowerCase();
                        tags[word] = (tags[word] || 0) + 1;
                    }
                }
            });
        tags = d3.entries(tags).sort(function(a, b) {
            return b.value - a.value;
        });
        tags.forEach(function(tag) {
            tag.key = tag_index[tag.key]
        });
        return tags;
    }

    function generate(tags,maxWords) {

        fontSize = d3.scale["log"]().range([10, 100]);
        tags.length && fontSize.domain([+tags[tags.length - 1].value || 1, +tags[0].value]);
        complete = 0;
        //statusText.style("display", null);
        words = [];
        layout.stop().words(tags.slice(0, maxWords = Math.min(tags.length, +maxWords))).start();
    }

    var layout = d3.layout.cloud()
    .timeInterval(10)
    .size([this.width, this.height])
    .fontSize(function(t) {
        return fontSize(+t.value)
    }).font("Impact")
        .spiral("archimedean")
    .text(function(t) {
        return t.key
    }).on("end", draw);

    function draw(words) {

        scale =1;

        var text = vis.parentGroup.selectAll("text")
            .data(words, function(t) {
            return t.text.toLowerCase()
        });
        text.transition()
            .duration(1000)
            .attr("transform", function(t) {
                return "translate(" + [t.x, t.y] + ")rotate(" + t.rotate + ")"
            })
            .style("font-size", function(t) {
                return t.size + "px"
            });
        text.enter()
            .append("text")
            .attr("text-anchor", "middle")
            .attr("transform", function(t) {
                return "translate(" + [t.x, t.y] + ")rotate(" + t.rotate + ")"
            })
            .style("font-size", "1px")
            .transition()
            .duration(1000)
            .style("font-size", function(t) {
                return t.size + "px"
            });
        text.style("font-family", function(t) {
                return t.font
            })
            .style("fill", function(t) {
                return fill(t.text.toLowerCase())
            })
            .text(function(t) {
                return t.text
            })
            .on('mouseover',function(d){
                this.style["opacity"] =0.3;
            })
            .on('mouseout',function(d){
                this.style["opacity"] =1;
            })
            .on('mousedown',function(d){
                this.style["opacity"] =1;
                console.log(d);
                incidents = [];
                vis.data.values.forEach(function(t){
                    if(t.text.indexOf(d.text) >= 0){
                        incidents.push(t);
                    }
                });

                console.log(incidents);
            });



        text.exit()
            .each(function() {
                r.appendChild(this)
        });

        //vis.background.append("g")
        //    .attr("transform", vis.attr("transform"))
        //    .transition()
        //    .duration(1000)
        //    .style("opacity", 0)
        //    .remove();

        vis.parentGroup.transition()
            .delay(1000)
            .duration(750)
            .attr("transform", "translate(" + [vis.centerX, vis.centerY] + ")scale(" + scale + ")")
}

    var corpus = vis.data.values.map(function(d){ return d.text;}).join(' ');
    //corpus = corpus.replace('  ','');
    var tags = parseText(corpus);

    console.log(corpus);
    console.log(tags);

    console.log(tags.slice(0, maxWords = Math.min(tags.length, +vis.maxWords)));

    generate(tags,vis.maxWords);
}

