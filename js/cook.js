'use strict';

const check=() => {
    const checkCookie = (name) => {
        const cookie = document.cookie.split('; ').find(row => row.startsWith(name));
        return cookie ? true : false;
    };
    const setCookie = (name, value, days) => {
        let expires = '';

        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }

        document.cookie = name + '=' + (value || '') + expires + '; path=/';
    };

    const bunt = document.createElement('div');

    bunt.insertAdjacentHTML('beforeend', `
        <div style="
            align-items: center;
            background: #f5f5f5;
            border-top: 1px solid #ccc;
            bottom: -5rem;
            box-sizing: border-box;
            color: black;
            display: flex;
            flex-wrap: wrap;
            font-size: .83rem;
            gap: 1rem 1.5rem;
            justify-content: center;
            line-height: 1.5;
            left: 0;
            padding: 1.5rem 2rem;
            position: fixed;
            text-align: left;
            transition: bottom .5s ease-in-out;
            width: 100%;
            z-index: 100;
        ">
            <p style="
                flex-grow: 1;
                flex-shrink: 1;
                margin: 0;
                max-width: 40rem;
                min-width: 300px;
                padding: 0;
                width: calc(100% - 11rem);
            ">
                このサイトでは、JavaScriptと、Cookieを使用しています。JavaScriptを有効にしてください。
                閉じるボタンをクリックすると、Cookieの使用に同意したものとします。
            </p>
            <button id="cookieButton">
                閉じる
            </button>
        </div>
    `);

    if (!checkCookie('check')) {
        // Append banner to body
        document.body.appendChild(bunt);

        setTimeout(() => {
            bunt.querySelector('div').style.bottom = '0';
        }, 20);

        document.getElementById('cookieButton').addEventListener('click', () => {
            // 10days
            setCookie('check', 'agree', 10);
            // Remove
            document.body.removeChild(bunt);
        });
    }
};
check();