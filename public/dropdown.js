function main(){
$(".dropdown").hide();
$(".dropdown").fadeIn(1000);
  $(".projects").hide();
  $(".projects-button").on("click", function(){
    $(this).toggleClass("active");
     $(this).next().slideToggle(400);
  });
                   }
$(document).ready(main);
