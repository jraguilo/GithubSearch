$(document).ready(function() {
    var url = 'https://api.github.com/search/repositories';
    var page;
    
    $('#ghsearch').keypress(function(e){
        if(e.which == 13) {
            searchRepo();
        }
    });
    
    $('#ghsubmitbtn').on('click', function(e){
        e.preventDefault();
        searchRepo();      
    });


    function searchRepo(){
        var search = $('#ghsearch').val();
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
    
        var request = {
            q : search,
            sort : sort,
            order : order,
        };

        $.getJSON(url, request, function(json){
            var repocount = json.total_count;
            var outhtml = '<p>repositories found: ' + repocount + '</p>';
            outhtml = outhtml + '<div><p><strong>Repository List:</strong></p>';
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
        $('#ghapidata').html(outhtml);
    });    
    
  }
  
    function getDateString(updated){
        var datestring;
        var day = updated.substring(8,10);
        var month = updated.substring(5, 7);
        var year = updated.substring(0,4);
        datestring = 'last updated ' + month + '-' + day + "-" + year;
        return datestring;
    }
  
  
});