"use strict";

var app;

function ArticleModel() {
  var self = this;
  this.article_data = null;
  // this.title = article.title

  this.getArticleJSON = function(cb) {
    $.getJSON('js/mock_data.json')
     .done(function(data){
        cb(self.save(data.article))
    })
  }

  this.save = function(article, cb) {
    self.title = article.title
    self.author = article.author
    self.publisher = article.publisher 
    self.date_published = article.date_published
    self.original_url = article.original_url
    self.title = article.title
    self.sentence = article.sentence
    return self
  }

  this.sentenceGenerator = function* () {
    var n = this.sentence.length
    for(var i=0; i<n; i++) {
      yield self.sentence[i];
    }
  }

  return this;
}

function CarriageCtrl(view, model) {
  this.view = new view()
  this.model = new model()
  this.article_data = null;

  this.init = function() {
    var self = this;
    this.model.getArticleJSON(function(_){
      self.view.render(self.model)
    })
  }

  this.pprint = function() {
    // utitlity function to pretty print model data
    return JSON.stringify(this.model.sentence, null, 2)
  }

  return this;

}

function CarriageView() {
  var self = this,
      carriage_tmpl = $('#carriage-tmpl').html(),
      tag_tmpl = $('#tag-tmpl').html(),
      $tag_picker = $($('#tag-picker-tmpl').html()),
      $active_carriage = $('.carriage#active')

  this.render = function(articleModel){
    // render article metadata
    $('#container').append(articleModel.title)
    $('#container').append(articleModel.author)

    // render sentences
    var new_elements = [],
        sentenceIter = articleModel.sentenceGenerator(),
        next = sentenceIter.next(),
        sentence;
    while (!next.done) {
      sentence = next.value; // the sentence object
      var $carriage = $(render(carriage_tmpl, sentence))
      addTags($carriage.find('.tags'), sentence.tags)
      addCommentArea($carriage, sentence)
      new_elements.push(
        bindListeners($carriage, sentence)
      )
      next = sentenceIter.next()
    }
    $('#container').append(new_elements)

  }

  function addTags($tags_target, tags) {
    $tags_target.empty()
    tags.forEach(function(tag, i){
      if (tag == null) { return }
      var $tag = $("<div class='tag'>" + tag + "</div>").on('click', function(){
        this.remove();
        tags[i] = null;
      })
      $tags_target.append($tag)
    })
  }

  function bindListeners($carriage, sentence) {
    return $carriage.on('click', '.sentence', function(){
      toggleActiveCarriage($(this), sentence)
    })
  }

  function toggleActiveCarriage($this, sentence) {
    if ($this.parent('.carriage#active').length){ return false }
    toggleActiveEditor($this, sentence)
    moveAndRebindTagPicker(sentence.tags)
  }

  function toggleActiveEditor($this, sentence) {
    $active_carriage.length && $active_carriage.attr('id', '').find('div.editor').hide()
    $active_carriage = $this.parent('.carriage').attr('id', 'active')
    $active_carriage.find('div.editor').show()
  }

  function addCommentArea($carriage, sentence) {
    var $textarea = $('<textarea>' + sentence.comment + '</textarea>').on('blur', function(){
      sentence.comment = $(this).val()
    })
    $carriage.find('.editor div.comment').append($textarea)
  }

  function moveAndRebindTagPicker(tags) {
    $('#tag-picker').remove()
    $tag_picker.on('click', '.tag', function(){
      var tag = $(this).text()
      addOrRemoveTags(tags, tag, $active_carriage)
    })
    $active_carriage.find('.tag-picker').append($tag_picker)
  }

  function addOrRemoveTags(tags, tag, $carriage) {
    var idx = tags.indexOf(tag)
    if ( idx === -1 ){
      tags.push(tag)
    } else {
      tags[idx] = null;
    }
    addTags($carriage.find('.tags'), tags)
  }

  return this;

}


//*******************************************
// THIRD PARTY
//*******************************************

// render function modified from riot.js framework
var template_escape = {"\\": "\\\\", "\n": "\\n", "\r": "\\r", "'": "\\'"}

function render(tmpl, data, escape_fn) {
  tmpl = tmpl || '';
  return ( new Function("_", "e", "return '" +
    tmpl.replace(/[\\\n\r']/g, function(char) {
      return template_escape[char];
    }).replace(/{{\s*([\w\d\.]+)\s*}}/g, "' + (e?e(_.$1,'$1'):_.$1||(_.$1==null?'':_.$1)) + '") + "'")
  )(data, escape_fn);
};


//*******************************************


$(document).ready(function(){
  
  app = new CarriageCtrl( CarriageView, ArticleModel )
  app.init()

})
