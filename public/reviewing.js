
$(document).ready(function(){

    const overall = $('#overall');
    const atmosphere = $('#atmosphere');
    const coffee_quality = $('#coffee_quality');
    const dairy_free = $('#dairy_free');
    const star1 = $('[name="rating"]');
    const star2 = $('[name="rating1"]');
    const star3 = $('[name="rating2"]');
    const star4 = $('[name="rating3"]');
    
    star1.click(function(event){
        overall.val(event.target.value);
    });
    star2.click(function(event){
        atmosphere.val(event.target.value);
    });

    star3.click(function(event){
        coffee_quality.val(event.target.value);
    });

    star4.click(function(event){
        dairy_free.val(event.target.value);
    });
});
