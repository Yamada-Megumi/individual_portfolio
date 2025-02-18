<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // フォームデータを受け取る
    $user = isset($_POST['user']) ? $_POST['user'] : '';
    $mail = isset($_POST['mail']) ? $_POST['mail'] : '';
    $memo = isset($_POST['memo']) ? $_POST['memo'] : '';

    // var_dump($_POST);

    // データを処理する（例：メール送信）
    // ここにメール送信のコードを追加できます
    // mail($to, $subject, $message, $headers);
    $to = $mail;
    $from = "yamada@st-yamada.com";
    $subject = "お問い合わせ | Works of やまだめぐみ";
    $message = <<<EOM
{$user}さま

お問い合わせありがとうございます。
以下の内容でお問い合わせを受け付けました。

お名前： {$user}
メールアドレス： {$mail} 
問い合わせ内容：
{$memo}

お問い合わせ内容については、後ほどご連絡いたします。
しばらくお待ちください。

-------------------------------
やまだ　めぐみ
URL: http://www.st-yamada.com
メール: yamada@st-yamada.com


・このメールは自動送信です。
このメールに心当たりがない場合は、お手数ですが破棄してください。
EOM;

    $headers = array(
        'From' => $mail,
        'Reply-To' => $mail,
        'Bcc' => $from,
        'X-Mailer' => 'PHP/' . phpversion()
    );

    if($user == "おなまえ" || $user == "お名前" || $memo == "問い合わせ内容" || $memo == "内容"){
        $check_erro = "error01";
    }
    // 迷惑メール対策
    if($check_erro === "error01"){
        echo "送信エラー";
    }else{
        if(mb_send_mail($to,$subject,$message,$headers)){
            echo "メール送信成功";
        }else{
            echo "メール送信失敗";
        }
    }



$host  = $_SERVER['HTTP_HOST'];
$uri   = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
$extra = 'index.html';
header("Location: http://$host$uri/$extra");
exit;

}




// 確認のための出力
echo "ユーザー名: " . htmlspecialchars($user) . "<br>";
echo "メールアドレス: " . htmlspecialchars($mail) . "<br>";
echo "問い合わせ内容: " . nl2br(htmlspecialchars($memo)) . "<br>";

?>