<?php
  header ("Content-Type:text/html; charset=UTF-8", false);
  header ("Content-Type:text/html;charset=UTF8", false);
  header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");
  header("Last-Modified: " . gmdate("D, d M Y H:i:s")." GMT");
  header("Cache-Control: no-cache, must-revalidate");
  header("Cache-Control: post-check=0,pre-check=0", false);
  header("Cache-Control: max-age=0", false);
  header("Pragma: no-cache");
?>
<!DOCTYPE HTML>
<html>

<head>
  <title>lightBox</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <link href="css/lightBox.css" rel="stylesheet" />
  
  <style>

  body{
  	background: #10283d;
  }

  *{
      margin: 0;
      padding : 0;
      position: relative;
      box-sizing: border-box;
  }
  .lightBox, .post{
      height:177px;
      cursor: pointer;
  }
  .wrap{
    display: inline-block;
    margin-left: 33px;
    margin-bottom: 33px;
    text-align: center;
  }
  #post, .lightBox2{
    box-shadow: 0 0 7px white;
    padding: 33px 33px 0 0;
    margin: 0 33px 33px 33px;
  }
  @media screen and (max-width: 600px) { 
    .lightBox, .post{
        height: auto;
        width: 100%;
    }
    .wrap{
      width: 100%;
      margin-left: 0;
    }
    #post, .lightBox2{
      box-shadow: 0 0 7px white;
      padding: 0;
      margin: 0 33px 33px 33px;
    }
  }
  </style>
</head>

<body>

  <img src="inc/1465303966.5027.png" style="width: 70%; display: block; margin:55px auto;" alt="" />

    <div id="post">

    <?php
      
      $imgs = glob('img/*');

      foreach($imgs as $img) {
        if (preg_match('/\.(jpg|png|gif)$/', $img)) {
          echo "<div class='wrap'>
                <img style='' class='post' src='$img'>
                </div>";
        }
      }

    ?>

  </div>

<!--  <div class="lightBox2">

    <?php
    
      $imgs = glob('img2/*');

      foreach($imgs as $img) {
        if (preg_match('/\.(jpg|png|gif)$/', $img)) {
          echo "<div class='wrap'>
                <img class='lightBox' src='$img'>
                </div>";
        }
      }

    ?>

  </div>-->

  <script src="js/jquery-1.11.1.min.js"></script>
  <script src="js/lightBox.js"></script>

</body>

</html>
