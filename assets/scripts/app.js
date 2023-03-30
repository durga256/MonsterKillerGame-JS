const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 15;
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

let enteredValue = parseInt(prompt('Max life for u and monster', '100'));

while (isNaN(enteredValue) || enteredValue <= 0){
    enteredValue = parseInt(prompt('Enter a +ve number. Max life for u and monster', '100'));
}

let chosenMaxLife = enteredValue;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let battleLog = [];

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
    let logEntry;
    logEntry = {
        event: event,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    }
    battleLog.push(logEntry);
}

function reset(){
    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);bn 
}
function attackMonster(mode){
    let maxDamage;
    if (mode == MODE_ATTACK){
        maxDamage = ATTACK_VALUE;
        writeToLog(LOG_EVENT_PLAYER_ATTACK, maxDamage, currentMonsterHealth, currentPlayerHealth);
    }else if(mode == MODE_STRONG_ATTACK){
        maxDamage = STRONG_ATTACK_VALUE;
        writeToLog(LOG_EVENT_PLAYER_STRONG_ATTACK, maxDamage, currentMonsterHealth, currentPlayerHealth);
    }
    const damage = dealMonsterDamage(maxDamage);
    currentMonsterHealth -= damage;
    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0){
        alert('You won');
    }
    attackPlayer();
}

function attackPlayer(){
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage;
    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMonsterHealth, currentPlayerHealth);
    if (currentPlayerHealth <= 0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = initialPlayerHealth;
        setPlayerHealth(currentPlayerHealth);
        alert('Youre on bonus life. Heal suggested.');
    }
    if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
        alert('You lost!');
    }
    else if(currentPlayerHealth <= 0 && currentMonsterHealth <= 0){
        alert('You have a draw!');
    }
    if (currentMonsterHealth <=0 || currentPlayerHealth <= 0){
        writeToLog(LOG_EVENT_GAME_OVER, playerDamage, currentMonsterHealth, currentPlayerHealth);
        reset();
    }
}

function attackHandler(){
    attackMonster(MODE_ATTACK);
}
function strongAttackHandler(){
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler(){
    let healValue;
    if (currentPlayerHealth + HEAL_VALUE > chosenMaxLife){
        healValue = chosenMaxLife - currentPlayerHealth;
        alert('You cant heal more than maxlife');
    }else{
        healValue = HEAL_VALUE;
    }
    currentPlayerHealth += healValue;
    writeToLog(LOG_EVENT_PLAYER_HEAL, healValue, currentMonsterHealth, currentPlayerHealth);
    increasePlayerHealth(HEAL_VALUE);
    attackPlayer();
}
function printLog(){
    for(const ele of battleLog){
        console.log(ele);
    }
}
attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLog);
