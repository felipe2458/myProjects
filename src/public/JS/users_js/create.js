$(function(){
    const nameCheck = $('input[name="name_create"]');
    const passwordCheck = $('input[name="password_create"]');
    const passwordConfirmCheck = $('input[name="password_confirm"]');
    const labelUser = $('label[for="username"]');
    const labelPass = $('label[for="password"]');
    const labelPassCon = $('label[for="passwordConfirm"]')
    let envUser = false;
    let envPass = false;
    let envPassCon = false;

    function verificarVal(element, label){
        element.focus(function(){
            $(label).css('top', '2px').css('font-size', '15px');
        }).blur(function(){
            if(element.val() === ''){
                $(label).css('top', '30px').css('font-size', '16px');
            }else{
                $(label).css('top', '2px').css('font-size', '15px');
            }
        });
    }

    verificarVal(nameCheck, labelUser);
    verificarVal(passwordCheck, labelPass);
    verificarVal(passwordConfirmCheck, labelPassCon);

    const iconPass = $('.pass');

    function showPass(){
        iconPass.click(function(){
            if($(this).children('.hide').hasClass('marcado')){
                $(this).children('.hide').removeClass('marcado');
            }else{
                $(this).children('.hide').addClass('marcado');
            }
        });

        iconPass.eq(0).click(function(){
            if(passwordCheck.attr('type') === 'password'){
                passwordCheck.attr('type', 'text');
            }else{
                passwordCheck.attr('type', 'password');
            }
        });

        iconPass.eq(1).click(function(){
            if(passwordConfirmCheck.attr('type') === 'password'){
                passwordConfirmCheck.attr('type', 'text');
            }else{
                passwordConfirmCheck.attr('type', 'password');
            }
        });
    };

    const erroMsg = $('.erro');

    function verificarPass(){
        if(passwordConfirmCheck.val() !== passwordCheck.val()){
            passwordCheck.css('boxShadow', '0 0 3px rgb(175, 11, 11)').css('color', 'rgb(175, 11, 11)');
            passwordConfirmCheck.css('boxShadow', '0 0 3px rgb(175, 11, 11)').css('color', 'rgb(175, 11, 11)');
            erroMsg.eq(1).addClass('show');
            erroMsg.eq(2).addClass('show');
            erroMsg.eq(2).text('As senhas não coincidem.');
            envPass = false;
            envPassCon = false;
        }else if(passwordCheck.val().length > 8){
            passwordCheck.css('boxShadow', '0 0 3px #00e000').css('color', '#00e000');
            passwordConfirmCheck.css('boxShadow', '0 0 3px #00e000').css('color', '#00e000');
            erroMsg.eq(1).removeClass('show');
            erroMsg.eq(2).removeClass('show');
            envPass = true;
            envPassCon = true;
        }
    }

    function verificarTamanhoPass(){
        if(passwordCheck.val().length < 8){
            erroMsg.eq(1).text('A senha deve ter mais que 8 caracteres.');
            envPass = false;
            envPassCon = false;
        }else if(passwordCheck.val().length > 100){
            erroMsg.eq(1).text('A senha deve ter menos que 100 caracteres.');
            envPass = false;
            envPassCon = false;
        }else if(passwordCheck.val() !== passwordConfirmCheck.val()){
            erroMsg.eq(1).text('As senhas não coincidem.');
            envPass = false;
            envPassCon = false;
        }
    }

    function verificarUser(){
        if(nameCheck.val() < 10){
            nameCheck.css('boxShadow', '0 0 3px rgb(175, 11, 11)').css('color', 'rgb(175, 11, 11)');
            erroMsg.eq(0).addClass('show');
            erroMsg.eq(0).text('O nome deve ter mais que 10 caracteres.');
        }else if(nameCheck.val().length > 255){
            nameCheck.css('boxShadow', '0 0 3px rgb(175, 11, 11)').css('color', 'rgb(175, 11, 11)');
            erroMsg.eq(0).addClass('show');
            erroMsg.eq(0).text('O nome deve ter menos que 255 caracteres.');
        }else if(nameCheck.val().length > 10){
            nameCheck.css('boxShadow', '0 0 3px #00e000').css('color', '#00e000');
            erroMsg.eq(0).removeClass('show');
        }
    };

    nameCheck.keyup(function(){
        verificarUser();
    });

    nameCheck.keydown(function(){
        verificarUser();
    });

    passwordCheck.keyup(function(){
        verificarPass();
        verificarTamanhoPass();
    });

    passwordCheck.keydown(function(){
        verificarPass();
        verificarTamanhoPass();
    });

    passwordConfirmCheck.keyup(function(){
        verificarPass();
    });

    passwordConfirmCheck.keydown(function(){
        verificarPass();
    });

    showPass();

    const action = $('#action');

    action.click(function(e){

        if(envUser || envPass || envPassCon){
            return true;
        }else{
            e.preventDefault();
        }
    });
});