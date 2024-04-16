var date = new Date;

function initLocalClocks() {
    var seconds = date.getSeconds();
    var minutes = date.getMinutes();
    var hours = date.getHours();
  
    var hands = [
        {
            hand: 'hours',
            angle: (hours * 30) + (minutes / 2)
        },
        {
            hand: 'minutes',
            angle: (minutes * 6)
        },
        {
            hand: 'seconds',
            angle: (seconds * 6)
        }
    ];
    for (var j = 0; j < hands.length; j++) {
        var elements = document.querySelectorAll('.' + hands[j].hand);
        for (var k = 0; k < elements.length; k++) {
            elements[k].style.webkitTransform = 'rotateZ('+ hands[j].angle +'deg)';
            elements[k].style.transform = 'rotateZ('+ hands[j].angle +'deg)';
            if (hands[j].hand === 'minutes') {
                elements[k].parentNode.setAttribute('data-second-angle', hands[j + 1].angle);
            }
        }
    }
}

function setUpMinuteHands() {
    var containers = document.querySelectorAll('.minutes-container');
    var secondAngle = containers[0].getAttribute("data-second-angle");
    if (secondAngle > 0) {
        var delay = (((360 - secondAngle) / 6) + 0.1) * 1000;
        setTimeout(function() {
            moveMinuteHands(containers);
        }, delay);
    }
}

function moveMinuteHands(containers) {
    for (var i = 0; i < containers.length; i++) {
        containers[i].style.webkitTransform = 'rotateZ(6deg)';
        containers[i].style.transform = 'rotateZ(6deg)';
    }
    var intervalId = setInterval(function() {
        if(localStorage.getItem('fin du jeu') === 'true') {
            clearInterval(intervalId);
        } else {
            for (var i = 0; i < containers.length; i++) {
                if (containers[i].angle === undefined) {
                    containers[i].angle = 12;
                } else {
                    containers[i].angle += 6;
                }
                containers[i].style.webkitTransform = 'rotateZ('+ containers[i].angle +'deg)';
                containers[i].style.transform = 'rotateZ('+ containers[i].angle +'deg)';
            }
        }
    }, 60000);
}

function moveSecondHands() {
    var containers = document.querySelectorAll('.seconds-container');
    var intervalId = setInterval(function() {
        if(localStorage.getItem('fin du jeu') === 'true') {
            clearInterval(intervalId);
            var temps = new Date - date;
            // Transforme le temps en minutes et en secondes
            var minutes = Math.floor((temps / 1000) / 60);
            var secondes = Math.floor((temps / 1000) % 60);
            document.querySelector('.timerFin').innerHTML = 'Vous avez mis ' + minutes + ' minutes et ' + secondes + ' secondes.';
        } else {
            for (var i = 0; i < containers.length; i++) {
                if (containers[i].angle === undefined) {
                containers[i].angle = 6;
                } else {
                containers[i].angle += 6;
                }
                containers[i].style.webkitTransform = 'rotateZ('+ containers[i].angle +'deg)';
                containers[i].style.transform = 'rotateZ('+ containers[i].angle +'deg)';
            }
        }
    }, 1000);
}

initLocalClocks();
setUpMinuteHands();
moveSecondHands();
