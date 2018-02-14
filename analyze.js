function setdefaultoptions() {
    var defaults = ["veryCheck", "badAdverbCheck", "sentenceLengthCheck", "repeatWordCheck"];
    for (var i = 0; i < defaults.length; i++) {
      document.getElementById(defaults[i]).checked = true;
    }
}

function parseWords(allWords) {
    var word = {
      value: "",
      marked: false,
      markedVal: 0
    };
    var sentence = {
      words: [],
      marked: false,
      markedVal: 0
    };
    var allInfo = {
      words: [],
      sentences: []
    }
    for (var i = 0; i < allWords.length; i++) {
      var c = allWords.charAt(i);
      if (c === '\n') {
        if (word.value.length > 0) {
          sentence.words.push(word);
        }
        sentence.words.push({
          value: "\n",
          marked: false,
          markedVal: 0
        });
        allInfo.words.push(word);
        allInfo.words.push({
          value: "\n",
          marked: false,
          markedVal: 0
        });
        word = {
          value: "",
          marked: false,
          markedVal: 0
        };
        allInfo.sentences.push(sentence);
        sentence = {
          words: [],
          marked: false,
          markedVal: 0
        }
        continue;
      }
      else if (c === ' ' || c === '\t') {
          if (word.value !== "") {
            sentence.words.push(word);
            allInfo.words.push(word);
            word = {
              value: "",
              marked: false,
              markedVal: 0
            };
          }
          continue;
      }
      else if (c === '.' || c === '!' || c === '?') {
          sentence.words.push(word);
          allInfo.words.push(word);
          sentence.words.push({
            value: c,
            marked: false,
            markedVal: 0
          });
          allInfo.sentences.push(sentence);
          sentence = {
            words: [],
            marked: false,
            markedVal: 0
          };
          word = {
            value: "",
            marked: false,
            markedVal: 0
          };
          continue;
      }
      else {
        word.value = word.value.concat(c);
      }
    }
    if (word.value.length > 0) {
      sentence.words.push(word);
    }
    if (sentence.words.length > 0) {
      allInfo.sentences.push(sentence);
    }
    return allInfo;
}

function pasteText(sentences) {
    document.getElementById("inputarea").style.display = "none";
    results = "<p>";
    for (i in sentences) {
        sentence = sentences[i];
        if (sentence.marked) {
            results += "<span class=\"highlighted" + sentence.markedVal + "\">";
            for (j in sentence.words) {
              word = sentence.words[j];
              if ((word.value === '.' || word.value === '!' || word.value === '?') && (results.length > 3)) {
                  results = results.substring(0, results.length - 1);
              }
              if (word.value === '\n') {
                results += "</p><p>    ";
              }
              else if (word.marked) {
                results += "<span class=\"highlighted" + word.markedVal + "\">" + word.value + "</span> ";
              }
              else {
                results += word.value + " ";
              }
            }
            results += "</span>";
        }
        else {
            for (j in sentence.words) {
              word = sentence.words[j];
              if ((word.value === '.' || word.value === '!' || word.value === '?') && (results.length > 3)) {
                  results = results.substring(0, results.length - 1);
              }
              if (word.value === '\n') {
                results += "</p><p>";
              }
              if (word.marked) {
                results += "<span class=\"highlighted" + word.markedVal + "\">" + word.value + "</span> ";
              }
              else {
                results += word.value + " ";
              }
            }
        }
    }
    results += "</p>";
    console.log(results);
    $("#outputarea").html(results);

}

function checkSentenceLength(sentences) {
    if (!$('#sentenceLengthCheck').is(':checked')) {
      return;
    }
    for (var i = 1; i < sentences.length - 1; i++) {
       if (sentences[i].words.length === sentences[i-1].words.length && sentences[i].words.length === sentences[i+1].words.length) {
          sentences[i].marked = true;
          sentences[i].markedVal = 101;
          sentences[i-1].marked = true;
          sentences[i-1].markedVal = 101;
          sentences[i+1].marked = true;
          sentences[i+1].markedVal = 101;
       }
    }
}

function checkFirstWords(sentences) {
  console.log(sentences);
  console.log("Checking first words.");
  if (!$('#repeatWordCheck').is(':checked')) {
    return;
  }
  console.log("Really checking first words.");
  for (var i = 1; i < sentences.length; i++) {
     if (sentences[i].words[0].value.toLowerCase() === sentences[i-1].words[0].value.toLowerCase()) {
        console.log("Marking " + sentences[i].words[0]);
        sentences[i].words[0].marked = true;
        sentences[i].words[0].markedVal = 102;
        sentences[i-1].words[0].marked = true;
        sentences[i-1].words[0].markedVal = 102;
     }
  }
}

function findTroubleWord(words, value, num) {
  if (!$('#' + value + 'Check').is(':checked')) {
    return;
  }
  words.forEach(function(element) {
      if(element.value.toLowerCase() === value) {
          element.marked = true;
          element.markedVal = num;
      }
  });
}

function findBang(words) {
  if (!$('#bangCheck').is(':checked')) {
    return;
  }
  words.forEach(function(element) {
      if(element.value === "!") {
        element.marked = true;
        element.markedVal = 6;
      }
  });
}

function findAdverbs(words, sentences) {
  var lyWords = [];
  var currentLyIndex = 0;
  for (var i = 0; i < words.length; i++) {
      var word = words[i];
      if (word.value.endsWith("ly")) {
           lyWords.push(word);
           var thisIndex = i;
           $.ajax({
           type : "GET",
           url : "https://wordsapiv1.p.mashape.com/words/" + words[thisIndex].value + "/definitions",
           headers: {"X-Mashape-Key": "8HXj2NNzKGmshlvmsSxIoHzgJ4NKp12ajddjsnyPge7H9FIMc8", "X-Mashape-Host": "wordsapiv1.p.mashape.com"},
           datatype: "json",
           success : function(result) {
               for (var j = 0; j < result.definitions.length; j++) {
                 if (result.definitions[j].partOfSpeech === "adverb") {
                    lyWords[currentLyIndex].marked = true;
                    if (lyWords[currentLyIndex].markedVal == 102 || lyWords[currentLyIndex].markedVal == 104) {
                       console.log("marking a previously marked");
                       lyWords[currentLyIndex].markedVal = 104;
                    }
                    else {
                       console.log("making a new mark");
                       lyWords[currentLyIndex].markedVal = 4;
                    }
                 }
               }
               pasteText(sentences);
               currentLyIndex++;
           },
           error : function(result) {
             console.log("Could not find word: " + words[i]);
              currentLyIndex++;
           }
         });
      }
  }
  pasteText(sentences);
}

function analyze() {
    var allwords = document.getElementById("maintextarea").value;
    var words;
    var sentences;
    var allInfo = parseWords(allwords);
    words = allInfo.words;
    sentences = allInfo.sentences;

    findTroubleWord(words, "very", 1);
    findTroubleWord(words, "literally", 2);
    findTroubleWord(words, "really", 3);
    checkSentenceLength(sentences);
    checkFirstWords(sentences);
    findAdverbs(words, sentences);
    pasteText(sentences);
}

document.getElementById("startanalysis").addEventListener("click", analyze);


/*Wind howled through the night, carrying a scent that would change the world. A tall Shade lifted his head and sniffed the air. He looked human except for his crimson hair and maroon eyes.

He blinked in surprise. The message had been correct: they were here. Or was it a trap? He weighed the odds, then said icily, "Spread out; hide behind trees and bushes. Stop whoever is coming . . . or die. "

Around him shuffled twelve Urgals with short swords and round iron shields painted with black symbols. They resembled men with bowed legs and thick, brutish arms made for crushing. A pair of twisted horns grew above their small ears. The monsters hurried into the brush, grunting as they hid. Soon the rustling quieted and the forest was silent again.

The Shade peered around a thick tree and looked up the trail. It was too dark for any human to see, but for him the faint moonlight was like sunshine streaming between the trees; every detail was clear and sharp to his searching gaze. He remained unnaturally quiet, a long pale sword in his hand. A wire-thin scratch curved down the blade. The weapon was thin enough to slip between a pair of ribs, yet stout enough to hack through the hardest armor.

The Urgals could not see as well as the Shade; they groped like blind beggars, fumbling with their weapons. An owl screeched, cutting through the silence. No one relaxed until the bird flew past. Then the monsters shivered in the cold night; one snapped a twig with his heavy boot. The Shade hissed in anger, and the Urgals shrank back, motionless. He suppressed his distaste they smelled like fetid meat and turned away. They were tools, nothing more.

The Shade forced back his impatience as the minutes became hours. The scent must have wafted far ahead of its owners. He did not let the Urgals get up or warm themselves. He denied himself those luxuries, too, and stayed behind the tree, watching the trail. Another gust of wind rushed through the forest. The smell was stronger this time. Excited, he lifted a thin lip in a snarl.

Get ready, he whispered, his whole body vibrating. The tip of his sword moved in small circles. It had taken many plots and much pain to bring himself to this moment. It would not do to lose control now.

Eyes brightened under the Urgals thick brows, and the creatures gripped their weapons tighter. Ahead of them, the Shade heard a clink as something hard struck a loose stone. Faint smudges emerged from the darkness and advanced down the trail.

Three white horses with riders cantered toward the ambush, their heads held high and proud, their coats rippling in the moonlight like liquid silver.

On the first horse was an elf with pointed ears and elegantly slanted eyebrows. His build was slim but strong, like a rapier. A powerful bow was slung on his back. A sword pressed against his side opposite a quiver of arrows fletched with swan feathers.

The last rider had the same fair face and angled features as the other. He carried a long spear in his right hand and a white dagger at his belt. A helm of extraordinary craftsmanship, wrought with amber and gold, rested on his head.

Between these two rode a raven-haired elven lady, who surveyed her surroundings with poise. Framed by long black locks, her deep eyes shone with a driving force. Her clothes were unadorned, yet her beauty was undiminished. At her side was a sword, and on her back a long bow with a quiver. She carried in her lap a pouch that she frequently looked at, as if to reassure herself that it was still there.

The band of fire thickened, contracting the area the Urgals had to search. Suddenly, the Shade heard shouts and a coarse scream. Through the trees he saw three of his charges fall in a pile, mortally wounded. He caught a glimpse of the elf running from the remaining Urgals.

She fled toward the craggy piece of granite at a tremendous speed. The Shade examined the ground twenty feet below, then jumped and landed nimbly in front of her. She skidded around and sped back to the trail. Black Urgal blood dripped from her sword, staining the pouch in her hand.

The horned monsters came out of the forest and hemmed her in, blocking the only escape routes. Her head whipped around as she tried to find a way out. Seeing none, she drew herself up with regal disdain. The Shade approached her with a raised hand, allowing himself to enjoy her helplessness.

Get her.

As the Urgals surged forward, the elf pulled open the pouch, reached into it, and then let it drop to the ground. In her hands was a large sapphire stone that reflected the angry light of the fires. She raised it over her head, lips forming frantic words. Desperate, the Shade barked, Garjzla!

A ball of red flame sprang from his hand and flew toward the elf, fast as an arrow. But he was too late. A flash of emerald light briefly illuminated the forest, and the stone vanished. Then the red fire smote her and she collapsed.

The Shade howled in rage and stalked forward, flinging his sword at a tree. It passed halfway through the trunk, where it stuck, quivering. He shot nine bolts of energy from his palm which killed the Urgals instantly then ripped his sword free and strode to the elf.

Prophecies of revenge, spoken in a wretched language only he knew, rolled from his tongue. He clenched his thin hands and glared at the sky. The cold stars stared back, unwinking, otherworldly watchers. Disgust curled his lip before he turned back to the unconscious elf.

Her beauty, which would have entranced any mortal man, held no charm for him. He confirmed that the stone was gone, then retrieved his horse from its hiding place among the trees. After tying the elf onto the saddle, he mounted the charger and made his way out of the woods.

He quenched the fires in his path but left the rest to burn. */
