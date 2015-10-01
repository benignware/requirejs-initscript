(function () {
  
  function inArray(a, obj) {
    for (var i = 0; i < a.length; i++) {
      if (a[i] === obj) {
        return true;
      }
    }
    return false;
  }

  function elementInDocument(element) {
    while (element = element.parentNode) {
      if (element == document) {
          return true;
      }
    }
    return false;
  };
  
  function getAbsoluteURL (url) {
    var div = document.createElement('div');
    div.innerHTML = "<a></a>";
    div.firstChild.href = url; // Ensures that the href is properly escaped
    div.innerHTML = div.innerHTML; // Run the current innerHTML back through the parser
    return div.firstChild.href;
  }
  
  //Main module definition.
  define(['require', 'module'], function(req, module) {
    
    // holds already initialized scripts
    var initialized = [];
    
    function matchScripts(name) {
      
      var matches = [];
      var scripts = document.getElementsByTagName('script');
      
      var baseUrl = getAbsoluteURL(req.toUrl(''));
      
      var filename = baseUrl ? baseUrl.replace(/\/$/, "") + "/" + name + ".js" : name + ".js";
      
      for (var i = 0, script; script = scripts[i]; i++) {
        
        var match = null, src = null;
        
        src = getAbsoluteURL(script.getAttribute('data-main'));
        
        if (filename == src) {
          match = script;
        }
        
        src = getAbsoluteURL(script.getAttribute('src'));
        if (!script.getAttribute('data-requiremodule') && filename == src) {
          match = script;
        }
        
        if (match) {
          matches.push(match);
        }
        
      }
      
      return matches;
    }
   
    return {
      
      load: function (name, req, onload, config) {
        
        var result = null;

          
        if (!config.isBuild) {
          
          var baseUrl = req.toUrl('');
          
          name = config.deps && config.deps.length ? config.deps[0] : null;

          if (!name) {
            name = module.config().name;
          }
          
          if (name) {
            
            // remove removed nodes
            for (var i = 0, script; script = initialized[i]; i++) {
              if (!elementInDocument(script)) {
                initialized.splice(i);
                i--;
              }
            }
            
            // match current script
            var matches = matchScripts(name);
            
            for (var i = 0; i < matches.length; i++) {
              var match = matches[i];
              if (!inArray(match, initialized)) {
                result = match;
                break;
              }
            }
          }
        }
        
        initialized.push(result);
        
        onload(result);

      }
      
    };
    
  });
  
}());