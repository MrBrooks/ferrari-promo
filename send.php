<?php

if ($_POST) {

  $phone = htmlspecialchars($_POST["phone"]);
  $look_name = htmlspecialchars($_POST["look-name"]);
  $product_name = htmlspecialchars($_POST["product-name"]);
  $radio = "single";


  $json = array();


  function GenerateMailBody($radio, $look, $product, $phone){
    if($radio == "single"){
      return 'Заказ на примерку '.$look.': '.$product.'\n Телефон: '.$phone;
    }
    return 'Заказ на примерку '.$look.'\n Телефон: '.$phone;
  }

  function mime_header_encode($str, $data_charset, $send_charset) { 
    if($data_charset != $send_charset)
    $str=iconv($data_charset,$send_charset.'//IGNORE',$str);
    return ('=?'.$send_charset.'?B?'.base64_encode($str).'?=');
  }
  
  class TEmail {
    public $from_email;
    public $from_name;
    public $to_emails;
    public $to_name;
    public $subject;
    public $data_charset='UTF-8';
    public $send_charset='windows-1251';
    public $body='';
    public $type='text/plain';

    function send(){
      $dc = $this->data_charset;
      $sc = $this->send_charset;
      $enc_to = $this->to_emails;
      $enc_subject = mime_header_encode($this->subject,$dc,$sc);
      $enc_from = mime_header_encode($this->from_name,$dc,$sc).' <'.$this->from_email.'>';
      $enc_body = $dc==$sc?$this->body:iconv($dc,$sc.'//IGNORE',$this->body);
      $headers ='';
      $headers .= "Mime-Version: 1.0\r\n";
      $headers .= "Content-type: ".$this->type."; charset=".$sc."\r\n";
      $headers .= "From: ".$enc_from."\r\n";
      return mail($enc_to,$enc_subject,$enc_body,$headers);
    }
  }

  $emailgo= new TEmail; 
  $emailgo->from_email = 'callback-promo@ferrari-store.ru';
  $emailgo->from_name = 'CallBack from promo';
  $emailgo->to_emails = 'galeria@ferrari-store.ru, promo@ferrari-store.ru, pak@mbrooks.ru, timur@mbrooks.ru';
  $emailgo->to_name = "Call back";
  $emailgo->subject = 'Заявка на звонок';
  $emailgo->body = GenerateMailBody($radio, $look_name, $product_name, $phone);
  
  $emailgo->send();

  $json['error'] = 0;
  echo json_encode($json);
} else {
  echo 'GET LOST!';
}
?>