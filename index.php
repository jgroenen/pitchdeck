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
            $json = json_decode($postData);
            if (strlen($postData) > 10000 || empty($json)) {
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
    <link rel="stylesheet" href="/assets/css/style.css">
    <script src="/assets/js/vendor/require/require-2.1.15/require.js" data-main="/assets/js/app/bootstrap.js"></script>
</head>
<body>
</body>
</html>
