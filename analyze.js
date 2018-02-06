function setdefaultoptions() {
    var defaults = ["defaultCheck1", "defaultCheck4", "defaultCheck5", "defaultCheck6"];
    for (var i = 0; i < defaults.length; i++) {
      document.getElementById(defaults[i]).checked = true;
    }
}

function parseWords(allWords) {
    var wordVal = "";
    var word = {
      value: "",
      marked: false
    };
    var sentence = {
      words: [],
      marked: false
    };
    var allInfo = {
      words: [],
      sentences: []
    }
    for (var i = 0; i < allWords.length; i++) {
      var c = allWords.charAt(i);
      console.log(c);
      if (c === ' ' || c === '\t' || c === '\n') {
          sentence.words.push(word);
          allInfo.words.push(word);
          console.log("Found new word: ", word.value);
          word.value = "";
          continue;
      }
      if (c === '.' || c === '!' || c === '?') {
          sentence.words.push(word);
          allInfo.words.push(word);
          allInfo.sentences.push(sentence);
          console.log("Found new sentence: ", sentence);
          sentence.words = [];
          word.value = "";
          continue;
      }
      word.value = word.value.concat(c);
    }
    return allInfo;
}

function parseSentences(wordList) {
    var sentenceList = [];
    for (var i = 0; i < wordList.length; i++) {
        var sentence = [];
        console.log(wordList[i].value);
        while(i < wordList.length
            && wordList[i].value.search('.') == -1
            && wordList[i].value.search('?') == -1
            && wordList[i].value.search('!') == -1) {
          sentence.push(wordlist[i]);
          i++;
          console.log(wordList[i]);
        }
        sentenceList.push[sentence];
    }
    return sentenceList;
}

function analyze() {
    var allwords = document.getElementById("maintextarea").value
    var words;
    var sentences;
    var allInfo = parseWords(allwords);
    words = allInfo.words;
    sentences = allInfo.sentences;
    console.log(words);
    console.log(sentences);
}

document.getElementById("startanalysis").addEventListener("click", analyze);
