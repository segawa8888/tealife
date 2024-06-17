
/*----- Radio Botton -----*/
$(function() {
  $('[name="buy"]:radio').change( function() {
    if($('[id=select_radio1]').prop('checked')){
      $('.p-detail__plan__caution').hide();
      $('.btn_area01').show();
    } else if ($('[id=select_radio2]').prop('checked')) {
      $('.cart_btn_area').hide();
      $('.btn_area02').show();
    } 
  });
});

