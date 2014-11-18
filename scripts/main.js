$(document).ready(function() {
    var links = {}; 
    
    //event handlers
    $('#ghsearch').keypress(function(e){
        if(e.which == 13) {
            var search = $('#ghsearch').val();
            search = sanitizeInput(search);
            if(search.trim() != ""){
                $('#ghapidata').html('<div id="loader"><img src="css/loader.gif" alt="loading..."></div>')
                searchRepo(search);
            }
        }
    });
    
    $('#ghsubmitbtn').on('click', function(e){
        e.preventDefault();
        
        var search = $('#ghsearch').val();
            search = sanitizeInput(search);
            if(search.trim() != ""){
                $('#ghapidata').html('<div id="loader"><img src="css/loader.gif" alt="loading..."></div>')
                searchRepo(search);
            }
        searchRepo();      
    });
    
    $('#first').on('click', function(e){
        e.preventDefault();
        queryRepo(links['first']);      
    });
    
    $('#prev').on('click', function(e){
        e.preventDefault();
        queryRepo(links['prev']);      
    });
    
    $('#next').on('click', function(e){
        e.preventDefault();
        queryRepo(links['next']);      
    });   
    
    $('#last').on('click', function(e){
        e.preventDefault();
        queryRepo(links['last']);      
    });

    //prepares the search request
    function searchRepo(search){
        //hides page buttons on each new search
        $('#pages').addClass('hidden');
        
        //get input and prepare search request
        
        search = sanitizeInput(search);
        var sorttype = $('#sort-type').val();
        var sort;
        var order;
    
        switch(sorttype){
            case "best-match":
                sort = "default"
                order = "desc"
                break;
            case "most-star":
                sort = "stars"
                order = "desc"
                break;
            case "few-star":
                sort = "stars"
                order = "asc"
                break;
            case "most-fork":
                sort = "forks"
                order = "desc"
                break;
            case "few-fork":
                sort = "forks"
                order = "asc"
                break;
            case "rec-updated":
                sort = "updated"
                order = "desc"
                break;
            case "least-updated":
                sort = "updated"
                order = "asc"
                break;
            }
        var url = 'https://api.github.com/search/repositories';
    
        var request = {
            q : search,
            sort : sort,
            order : order,
        };
        queryRepo(url, request);
    }
    
    //performs the search request to GitHub API
    function queryRepo(url, request) {
        var ghquery = $.getJSON(url, request, function(json){            
            var repocount = json.total_count;
            var outhtml = '<h3><strong>Repositories Found: ' + repocount + '<strong></h3>';
            if(repocount > 1){
                parseLinkHeader(ghquery.getResponseHeader('link'));
                outhtml = outhtml + '<div><h3><strong>Repository List:</strong></h3>';
                $.each(json.items, function(index, value){
                    var reponame = value.full_name;
                    var repourl = value.html_url;
                    var repodesc = value.description;
                    var updated = getDateString(value.updated_at);
                    var forks = value.forks_count;
                    var stars = value.stargazers_count;
                    outhtml = outhtml + '<h3 class="repo-name"><a href="' + repourl + '">' + reponame + '</a></h3>';

                    outhtml = outhtml + '<p class="repo-desc">' + repodesc + '</p>';
                    outhtml = outhtml + '<p class="repo-counts">forks: ' + forks + ' stargazers: ' + stars + '</p>';
                    outhtml = outhtml + '<p class="repo-updated">' + updated + '</p>';
                });
                outhtml = outhtml + '</div>'; 
            }
            $('#ghapidata').html(outhtml);
        });    
    }
  
    //formats the updated date from the json output
    function getDateString(updated){
        var datestring;
        var day = updated.substring(8,10);
        var month = updated.substring(5, 7);
        var year = updated.substring(0,4);
        datestring = 'last updated ' + month + '-' + day + "-" + year;
        return datestring;
    }
    
    //retrieves links from the link header
    function parseLinkHeader(header) {
        if (header.length == 0) {
            throw new Error("invalid input");
        }
        //disable all page buttons
        $('#first').prop("disabled", true);
        $('#prev').prop("disabled", true);
        $('#next').prop("disabled", true);
        $('#last').prop("disabled", true);
        //split parts by comma
        var parts = header.split(',');

        var output = "";
        //parse each part into a named link
        $.each(parts, function(index, value){
            var section = value.split(';');
            if(section.length != 2) {
                throw new Error("Header could not be split on ';'");
            }
            var linkurl = section[0].replace(/<(.*)>/, '$1').trim();
            var linkname = section[1].replace(/rel="(.*)"/, '$1').trim();
            links[linkname] = linkurl;
            $('#'+linkname).prop("disabled", false); 
        });
        $('#pages').removeClass('hidden');
    }
  
    //sanitizes user input
    function sanitizeInput(input) {
        var output = input.replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, ' ')
	    return output;
    }
  
});