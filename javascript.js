(function() {
    'use strict';
    var result;
    var currNum;
    var prevResult;
    var history;
    var prevBtn;
    var mathOp;
    var prevMathOp;
    var mathOpCount
    var mathOpPress;
    var isInit;
    var mainScreen = document.querySelector('#main');
    var historyScreen = document.querySelector('#history');
    Array.prototype.forEach.call(document.querySelectorAll('.button'), function(btn) {
        btn.addEventListener('click', function(e) {
            var btnClicked = e.currentTarget.getAttribute('data-value');
            input(btnClicked);
        });
    });

    //
    function input(btn) {
        if (!isNaN(prevBtn) && btn !== '=' && btn !== 'C' && btn !== 'CE' && btn !== 'CS' && btn !== '.') {
            prevMathOp = mathOp;
        }

        switch(btn) {
            case '+': mathOpPress = true; mathOp = result += val; break;
            case '-': mathOpPress = true; mathOp = result -= val; break;
            case '/': mathOpPress = true; mathOp = result /= val;; break;
            case '*': mathOpPress = true; mathOp = result *= val; break;
            case 'C': result=0; break;
        }

        handler(btn);


        var fontSize = parseFloat(mainScreen.style.fontSize);
        if (fontSize < 3 && currNum.length < 11) {
            mainScreen.style.fontSize = '3rem';
        }
    }

    //
    function handler(btn) {
        if (btn !== 'C' && result === 'Result is undefined' || result === 'Cannot divide by zero') {
            return;
        }

        if (btn !== '=' && btn !== 'C' && btn !== 'CE' && btn !== 'CS') {
            history = (isNaN(prevBtn) && isNaN(btn)) ? history.slice(0, -1) + btn : history + btn;
        }

        if (!isNaN(btn) || btn === '.') {
            if (btn === '.' && /^\d+$/.test(currNum)) {
                currNum = currNum + btn;
            } else if (!isNaN(btn)) {
                currNum = (!isNaN(prevBtn) && prevBtn !== null && mainScreen.value !== '0') || prevBtn === '.' ? currNum + btn : btn;
            }
            mathOpPress = false;
            updateMainScreen(currNum);
        } else {

            if (btn === '-' || btn === '+' || btn === '*' || btn === '/') {
                if ((prevBtn === null || prevBtn === '=') && !isInit) {
                    history = '0' + btn;
                    mathOpCount++;
                }

                if (!historyScreen.value.length && mainScreen.value.length) {
                    history = mainScreen.value + btn;
                }
            }

            if (mathOp && result === null) {
                result = Number(currNum);
            }

            // count result
            if (btn === '=') {
                // if math op exists
                if (mathOp) {
                    mathOpCount = 0;
                    // if last button pressed is `mathOperation`
                    // like `+, - etc.` before `=` was pressed
                    if (mathOpPress) {
                        mathOp(prevResult);
                    // if last button pressed is `digit` before `=` was pressed
                    } else {
                        mathOp(Number(currNum));
                    }

                    history = '';
                    prevBtn = btn;

                    updateMainScreen(result);
                    updateHistoryScreen(history);

                    return;
                }
            }

            // count math ops
            // if sign was pressed and prev btn isn't sign and except some buttons
            if (isNaN(btn) && (!isNaN(prevBtn) || prevBtn === '%' || prevBtn === 'sqr' || prevBtn === 'sqrt' || prevBtn === '1/x') &&
                btn !== '=' && btn !== 'C' && btn !== 'CE' && btn !== 'CS' && btn !== '.' && btn !== '%' && btn !== 'sqr' & btn !== 'sqrt' && btn !== '1/x') {
                mathOpCount++;
            }

            // count result in row
            if (mathOpCount >= 2 && (!isNaN(prevBtn) || prevBtn === 'sqrt' || prevBtn === 'sqr' || prevBtn === '1/x' || prevBtn === '%') && btn !== 'CE' && btn !== 'CS') {
                prevMathOp(Number(currNum));
                updateMainScreen(result);
            }

            if (btn === 'CE' && history.length > 0) {
                history = history.slice(0, -(currNum.length));
                currNum = '0';
                updateMainScreen(0);
            } else if (btn === 'CS') {
                if (result != mainScreen.value) {
                    currNum = currNum.slice(0, -1);
                    history = history.slice(0, -1);
                    if (!currNum.length) {
                        currNum = '0';
                    }
                    updateMainScreen(currNum);
                } else {
                    return;
                }
            }

            if (result !== null && btn !== 'CE' && btn !== 'CS') {
                updateHistoryScreen(history);
            }
        }

        prevBtn = btn;
        prevResult = result;
        isInit = false;
    }

    function updateMainScreen(val) {
        val = String(val);

        if (val.length > 10) {
            mainScreen.style.fontSize = '1.75rem';
            val = Math.round(val * 10000000000000000) / 10000000000000000;
        }

        mainScreen.value = val;
    }

    function updateHistoryScreen(history) {
        historyScreen.value = history;
    }

    init();

})();
