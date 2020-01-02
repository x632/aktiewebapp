 var arr,aktiv=false,flyttKorTimer,flyttaKordTimer,rikt=0,riktning=0, bredd=7,timer,counter=0,data2,tid=[];uppLosning="";var res=[];
    var skrivUt = [],open=[],high =[],low=[],close=[], aktivArrayStorlek = 128,ma=[],ema=[],visaEMA=0.0,visaMA=0,data;
    var riktning=0;rikt=0;
    var timeSeries;
    function getAktie(data){
        open=[],high =[],low=[],close=[];ma=[];ema=[];
        const func = selFunction.value;
        const func2 = selInterval.value;
        if (func=="TIME_SERIES_DAILY")
        {timeSeries="Time Series (Daily)";
        uppLosning="Daily";
        }
        if (func=="TIME_SERIES_WEEKLY")
        {timeSeries="Weekly Time Series";
        uppLosning="Weekly";
        }
        if (func=="TIME_SERIES_INTRADAY" && func2=="60min")
        {timeSeries="Time Series (60min)";
        uppLosning="60min";
        }
        if (func=="TIME_SERIES_INTRADAY" && func2=="30min")
        {timeSeries="Time Series (30min)";
        uppLosning="30min";
        }
        if (func=="TIME_SERIES_INTRADAY" && func2=="15min")
        {timeSeries="Time Series (15min)"
        uppLosning="15min";
        }
        if (func=="TIME_SERIES_INTRADAY" && func2=="5min")
        {timeSeries="Time Series (5min)"
        uppLosning="5min";
        }
        if (func=="TIME_SERIES_INTRADAY" && func2=="1min")
        {timeSeries="Time Series (1min)"
        uppLosning="1min";
        }
        if (func=="TIME_SERIES_MONTHLY")
        {timeSeries="Monthly Time Series"
        uppLosning="Monthly";
        }
        rikt=0;riktning=0; 
        data2=JSON.parse(data);
        var aktien= data2["Meta Data"]["2. Symbol"];
        document.getElementById("aktien").textContent=aktien;
        arr=Object.entries(data2[timeSeries]);
        for (i = 0;i < arr.length; i++){
            tid [i]= arr[i][0];
            open[i] = parseFloat(arr[i][1]["1. open"]);
            high[i] = parseFloat(arr[i][1]["2. high"]);    
            low[i] = parseFloat(arr[i][1]["3. low"]);
            close[i] = parseFloat(arr[i][1]["4. close"]); 
        }
        if(visaMA>0){
            maInput(visaMA)
        }
        if(visaEMA>0){
            emaInput(visaEMA)
        }
        var input = document.getElementById("koordinat");
        input.setAttribute("max",close.length-aktivArrayStorlek); 
        ritaUtCandleSticks(0)
    }
    function upDate(){  
        if (counter%2==0){
            document.getElementById("realtime").style.backgroundColor = "#ff0000";    
        console.log("på "+counter);
        timer = setInterval(getAlphaVantagedata,15000);
        }
        if (counter%2!=0){
            document.getElementById("realtime").style.backgroundColor = "#922d0f"; 
            console.log("av "+counter);
            clearInterval(timer);
        }
        counter++;
        if(counter==100){counter=0};
    }
    function aktArrStorl(){
        aktivArrayStorlek = parseInt(document.getElementById("jusstorl").value);
            ritaUtCandleSticks(riktning);
        }
    function maInput(maAnta){
        if (maAnta>0) {
            for (i = 0; i < close.length; i++){ //loopar alla cs
            utrva=0.0;
            for (j = i; j < i+maAnta ; j++) {  //loopar antalMA på alla cs
            utrva += close[j];
            }
            ma[i]=utrva/maAnta;         
            }  
            visaMA=maAnta;
        }
        else {
             visaMA=0;
        }
        ritaUtCandleSticks(riktning)
    }   
    function emaInput(emaAnta){
        if (emaAnta > 0) {
            var k = 2.0/(emaAnta + 1.0);b=close.length-1;
            ema [b]= close[b];
            for (i = (b-1); i >0; i--) {
              ema[i]=(close[i] * k + ema[i + 1] * (1.0 - k));
            }
            visaEMA = parseFloat(emaAnta);    
        }
        else{
            visaEMA=0;
        }
        ritaUtCandleSticks(riktning) 
    }
    function channel(){
        riktning = parseInt(document.getElementById("koordinat").value);
        if (riktning>=close.length) {
            riktning=close.length-aktivArrayStorlek;
        } 
        ritaUtCandleSticks(riktning);
        }
    
    function sattBredd(){
        bredd = parseInt(document.getElementById("jusbredd").value);
        ritaUtCandleSticks(riktning);
        }
    function raknaUtRange(rikt){
        var aktivaArraynHigh = [],aktivaArraynLow = [],minsta,range = [],hogsta;
        minsta =high[rikt];
        hogsta =low[rikt];
        for (i=0+rikt; i<aktivArrayStorlek+rikt;i++){
            aktivaArraynHigh[i]=high[i];
            aktivaArraynLow[i]=low[i]
            if (hogsta<aktivaArraynHigh[i]){hogsta=aktivaArraynHigh[i]};
            if (minsta>aktivaArraynLow[i]){minsta=aktivaArraynLow[i]};
        }   
        range[0] = (hogsta - minsta);
        range[1] = hogsta;
        range[2] = minsta;
        range[3] = ((range[1]*100)/range[0])*0.01;
        return range;
    }    
   
    function ritaUtCandleSticks(riktning){
        if(riktning<0){riktning=0;}
        range=raknaUtRange(riktning);
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        //var aktivArrayStorlek = 130;//hur många csticks
        var ch=500,avstand=9,hojd,utr; //utr = variabeln som spegelvänder aktien 
        var hojd = (ch/range[0]);//range[0] = skillnaden mellan högsta och lägsta - "rangen"
        //range[3] = den procentuella skillnaden mellan range och högsta
        ch *= range[3];
        //färglägger bakgrunden
        ctx.clearRect(0, 0, window.innerWidth,window.innerHeight);
        ctx.fillStyle = '#ffd38b'; 
        ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    //rita ut prislinjerna och siffrorna
        var pris;
        pris=range[0]*0.10;//delar rangen i 10 delar med början från lägsta(range[2])
        for (i=range[2];i<=range[1];i+=pris){    
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.lineWidth=1;
            ctx.strokeStyle = '#909090';
            ctx.moveTo(0,ch-(i*hojd));//startpunkt x,y
            ctx.lineTo(1250,ch-(i*hojd));
            ctx.font = "11px Arial";
            var num = i;
            var pristext=num.toFixed(2);
            ctx.fillStyle = '#707070';
            ctx.fillText(pristext, 5, ch-(i*hojd)-3);
            ctx.fillText(pristext, 1215, ch-(i*hojd)-3);
            ctx.stroke();
        }
        //rita ut aktuella priset - linjen
        ctx.font = "15px Arial";
        ctx.beginPath();
        ctx.lineWidth=2;
        ctx.strokeStyle = '#0039e6';
        ctx.moveTo(0,ch-(close[0]*hojd));//startpunkt x,y
        ctx.lineTo(1250,ch-(close[0]*hojd));
        //rita ut aktuella priset - siffran
        num=close[0];
        pristext=num.toFixed(2);
        ctx.fillStyle = '#000095';
        ctx.fillText(pristext, 40, ch-(close[0]*hojd)+14);
        ctx.stroke();
    //rita ut candlesticks loopen ****************************************************
    for (i = aktivArrayStorlek; i > 0 ; i-- ){ //från aktivt arrayområdes slut till början			
        utr=(aktivArrayStorlek-i)+riktning;var xk=4;//xk=marginal
            //x koordinat - tiden DAGSFORMAT
            if (uppLosning=="Daily"){
                a = (tid[utr]);
                b = (tid[utr+1])
                c = a.slice(5,7);
                d = b.slice(5,7);
                f=parseInt(c);
                g=parseInt(d);
                if (f!=g){
                    //Utskrift av datumlinjerna
                    ctx.setLineDash([2, 3]);
                    ctx.beginPath();
                    ctx.lineWidth=1;
                    ctx.strokeStyle = '#909090';
                    ctx.moveTo((i+xk)*avstand+bredd,0);//startpunkt x,y
                    ctx.lineTo((i+xk)*avstand+bredd,ch);
                    ctx.stroke();
                    //********  datum utskrift  ********* 
                    ctx.fillStyle = '#909090';
                    ctx.font = "12px Arial";
                    ctx.fillText(tid[utr], ((i+1)+xk)*avstand+bredd, 520);
                    ctx.stroke();
                }
            }
            if (uppLosning=="Monthly"||uppLosning=="Weekly"){
                a = (tid[utr]);
                b = (tid[utr+1])
                c = a.slice(0,4);
                d = b.slice(0,4);
                f=parseInt(c);
                g=parseInt(d);
                if (f!=g){
                    //Utskrift av datumlinjerna
                    ctx.setLineDash([2, 3]);
                    ctx.beginPath();
                    ctx.lineWidth=1;
                    ctx.strokeStyle = '#909090';
                    ctx.moveTo((i+xk)*avstand+bredd,0);//startpunkt x,y
                    ctx.lineTo((i+xk)*avstand+bredd,ch);
                    ctx.stroke();
                    //********  datum utskrift  ********* 
                    ctx.fillStyle = '#909090';
                    ctx.font = "12px Arial";
                    ctx.fillText(c, ((i+1)+xk)*avstand+bredd, 520);
                    ctx.stroke();
                }
            }
            if (uppLosning=="1min"||uppLosning=="5min"||uppLosning=="15min"||uppLosning=="30min"||uppLosning=="60min"){
                if (tid[utr]!=""){
                    a = (tid[utr]);
                    b = (tid[utr+1])
                    c = a.slice(8,10);
                    d = b.slice(8,10);
                    e = a.slice(0,10);
                    f=parseInt(c);
                    g=parseInt(d);
                    if (f!=g){
                        //Utskrift av datumlinjerna
                        ctx.setLineDash([2, 3]);
                        ctx.beginPath();
                        ctx.lineWidth=1;
                        ctx.strokeStyle = '#909090';
                        ctx.moveTo((i+xk)*avstand+bredd,0);//startpunkt x,y
                        ctx.lineTo((i+xk)*avstand+bredd,ch);
                        ctx.stroke();
                        //********  datum utskrift  ********* 
                        ctx.fillStyle = '#909090';
                        ctx.font = "12px Arial";
                        ctx.fillText(e, ((i+1)+xk)*avstand+bredd, 520);
                        ctx.stroke();
                    }
                }   
            }
            ctx.setLineDash([]);//ta bort punkter från linjeritningen
           
            //rita ut MA
            if (visaMA>0){
            ctx.fillStyle = '#0000cc';
            ctx.fillRect((i+xk)*avstand+bredd+(bredd/2),ch-(ma[utr]*hojd),2,2);
            }
            //rita ut EMA
            if (visaEMA>0){
            ctx.fillStyle = '#CC0000';
            ctx.fillRect((i+xk)*avstand+bredd+(bredd/2),ch-(ema[utr]*hojd),2,2);
            }
    if (open[utr]>close[utr]) 	{				//BEARcandle
            //Rita kropp           
            ctx.lineWidth=1;
            ctx.fillStyle = '#FF0000';
            ctx.fillRect((i+xk)*avstand+bredd,ch-open[utr]*hojd,bredd,open[utr]*hojd-close[utr]*hojd);			
            //Rita veke ovanför
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle ='#000000';
            ctx.moveTo((i+xk)*avstand+bredd+(bredd/2),ch-open[utr]*hojd);//startpunkt x,y
            ctx.lineTo(((i+xk)*avstand+bredd)+(bredd/2),(ch-(open[utr]*hojd))+(ch-(high[utr]*hojd))-(ch-(open[utr]*hojd)));
            ctx.stroke();
            //Rita veke under
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle ="#000000";
            ctx.moveTo((i+xk)*avstand+bredd+(bredd/2),ch-low[utr]*hojd);
            ctx.lineTo((i+xk)*avstand+bredd+(bredd/2),ch-close[utr]*hojd);
            ctx.stroke();
    }
    if (close[utr]>open[utr]) 	{				//BULLcandle
    
        //Rita kropp
        ctx.lineWidth=1;
        ctx.fillStyle = "#009900";
        ctx.fillRect((i+xk)*avstand+bredd,ch-(close[utr]*hojd),bredd,close[utr]*hojd-open[utr]*hojd);//(startpunkt x,y),bredd,höjd						
        //veke ovanför
        ctx.beginPath();
        ctx.lineWidth=2;
        ctx.strokeStyle ="#000000";
        ctx.moveTo((i+xk)*avstand+bredd+(bredd/2),ch-(close[utr]*hojd));
        ctx.lineTo((i+xk)*avstand+bredd+(bredd/2),ch-(close[utr]*hojd)+(ch-(high[utr]*hojd))-(ch-(close[utr]*hojd)));
        ctx.stroke();
        //veke under
        ctx.beginPath();
        ctx.strokeStyle ="#000000";
        ctx.lineWidth=2;
        ctx.moveTo((i+xk)*avstand+bredd+(bredd/2),ch-open[utr]*hojd);
        ctx.lineTo((i+xk)*avstand+bredd+(bredd/2),ch-low[utr]*hojd);
        ctx.stroke();
    }
    if (close[utr]==open[utr]) 	{				//Doji
    
        //Rita kropp
        ctx.lineWidth=1;
        ctx.fillStyle ="#000000";
        ctx.moveTo((i+xk)*avstand+bredd,ch-close[utr]*hojd);
        ctx.lineTo((i+xk)*avstand+bredd+bredd,ch-close[utr]*hojd);
        ctx.stroke();
        //veke ovanför
        ctx.beginPath();
        ctx.lineWidth=2;
        ctx.strokeStyle ="#000000";
        ctx.moveTo((i+xk)*avstand+bredd+(bredd/2),ch-close[utr]*hojd);
        ctx.lineTo((i+xk)*avstand+bredd+(bredd/2),ch-(close[utr]*hojd)+(ch-(high[utr]*hojd))-(ch-(close[utr]*hojd)));
        ctx.stroke();
        //veke under
        ctx.beginPath();
        ctx.lineWidth=2;
        ctx.strokeStyle ="#000000";
        ctx.moveTo((i+xk)*avstand+bredd+(bredd/2),ch-open[utr]*hojd);
        ctx.lineTo((i+xk)*avstand+bredd+(bredd/2),ch-low[utr]*hojd);
        ctx.stroke();	
       			                               
    }
    } 
}
var timeSeries;
function getAlphaVantagedata() {
    console.log("Varit i getData ");
    const func = selFunction.value; //'function is a reserved word
    const size = selSize.value;
    const interval = selInterval.value;
    symbol = inpSymbol.value;
        url = 'https://www.alphavantage.co/query?function=' + func +
            '&symbol=' + symbol +
            '&interval=' + interval +
            '&outputsize=' + size +
            '&datatype=json' + 
            '&apikey=' + "PI94RGOINPZE8JOZ"
    
    requestFile( url );
}
function requestFile( url ) {
    const xhr = new XMLHttpRequest();
    xhr.open( 'GET', url, true );
    xhr.onerror = function( xhr ) { console.log( 'error:', xhr  ); };
    xhr.onprogress = function( xhr ) { console.log( 'bytes loaded:', xhr.loaded  ); }; /// or something
    xhr.onload = callback;
    xhr.send( null );
    function callback( xhr ) {
        const response = xhr.target.response;
        data = response;
        if (response.slice( 0, 1) !== '{' ) { return; } // not a json file
        getAktie(data);

    }
}
function sInterval() {
    spnInterval.style.display = selFunction.value !== 'TIME_SERIES_INTRADAY' ? 'none' : '';
}