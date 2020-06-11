<?php

    $dirTmpl = __DIR__ . "/savedDecks/%s.json"; // getenv('STORAGE_PATH')
    $uriParts = array_values(array_filter(explode("/", $_SERVER["REQUEST_URI"])));
    $controller = array_shift($uriParts);
    
    function createToken() {
        $token = "";
        $alphabet = "abcdefghijklmnopqrstuvwxyz";
        while (strlen($token) < 8) {
            $i = mt_rand(0, strlen($alphabet) - 1);
            $token .= $alphabet[$i];
        }
        return $token;
    }
    
    if ($controller === "decks") {
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $postData = file_get_contents("php://input");
            if (strlen($postData) > 10000) {
                header("HTTP/1.1 400 Bad Request");
                exit;
            }
            do {
                $token = createToken();
                $filePath = sprintf($dirTmpl, $token);
            } while (file_exists($filePath));
            file_put_contents($filePath, $postData);
            exit($token);
        } else {
            $token = array_shift($uriParts); // get token
            $filePath = sprintf($dirTmpl, $token);
            if (file_exists($filePath)) {
                header("Content-type: application/json");
                echo(file_get_contents($filePath));
            } else {
                header("HTTP/1.1 404 File Not Found");
                exit;
            }
        }
        exit;
    }
?>
<!DOCTYPE html>
<html>
<head>
    <title>Pitchdeck Generator</title>
    <meta name='viewport' content='width=320,initial-scale=1,user-scalable=0'>
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="author" content="Johan Groenen (c) 2015">
    <link href='http://fonts.googleapis.com/css?family=Open+Sans' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="/assets/css/reset.css">
    
<?php if ($_SERVER["HTTP_HOST"] !== "pitchdeck.tiltshift.nl") { ?>
    <link rel="stylesheet" href="/assets/css/style.css">
<?php } else { ?>
    <link rel="stylesheet" href="/assets/css/tiltshift.css">
<?php } ?>

    <script src="/assets/js/vendor/require/require-2.1.15/require.js" data-main="/assets/js/app/bootstrap.js"></script>
    
    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
        ga('create', 'UA-37914920-2', 'auto');
        ga('send', 'pageview');
    </script>
    
</head>
<body>
</body>
</html>
