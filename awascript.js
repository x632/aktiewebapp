//setInterval('getISS()', 3000)
    var arr;
    //const api_url = 'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=STO:LUC&interval=5min&outputsize=compact&apikey=PI94RGOINPZE8JOZ'
    //const api_url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+symbol+'&outputsize=compact&apikey=PI94RGOINPZE8JOZ'
    var skrivUt = [];  var open=[],high =[],low=[],close=[], aktivArrayStorlek = 130;

    async function getAktie(symbol){
        const api_url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol='+symbol+'&outputsize=full&apikey=PI94RGOINPZE8JOZ'
        const response = await fetch(api_url);
        const data = await response.json();
        //console.log(data);
        if (data["Meta Data"]["2. Symbol"]==undefined);{
          document.getElementById("aktien").textContent="Just nu är inte denna aktie nåbar på servern, vänta en stund och prova igen, eller prova med en annan aktie."; 
        } 
        var aktien=data["Meta Data"]["2. Symbol"];
        document.getElementById("aktien").textContent=aktien;
        arr = Object.entries(data["Time Series (Daily)"]);
        for (i = 0;i < arr.length; i++){
            var tid = (arr[i][0]);
            open[i] = parseFloat(arr[i][1]["1. open"]);
            high[i] = parseFloat(arr[i][1]["2. high"]);    
            low[i] = parseFloat(arr[i][1]["3. low"]);
            close[i] = parseFloat(arr[i][1]["4. close"]); 

            //skrivUt [i]="Tid "+tid+" Open: "+open+" High "+high+" Low "+low+" Close "+close+" ";
            
            }
            range = raknaUtRange();
            ritaUtCandleSticks()
    }
    function raknaUtRange(){
        var aktivaArraynHigh =[],aktivaArraynLow=[],storsta,minsta,range=[];
        for (i=0; i<aktivArrayStorlek;i++){
        aktivaArraynHigh[i]=high[i];aktivaArraynLow[i]=low[i]}
        storsta=Math.max.apply(null, aktivaArraynHigh);
        minsta=Math.min.apply(null, aktivaArraynLow);
        console.log(storsta+" "+minsta);
        range[0] = 1.05*(storsta - minsta);
        range[1] = storsta;
        range[2] = minsta;
        range[3] = ((range[1]*100)/range[0])/100;
        return range;
    }    
    function ritaUtCandleSticks(){
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        var aktivArrayStorlek = 130;
        var bredd=6,ch=600,avstand=9,hojd,utr; //utr = variabeln som spegelvänder aktien 
        hojd = ch/range[0];//range[0] = skillnaden mellan högsta och lägsta "rangen" helt enkelt.
        ch *= range[3]//range[3] = den procentuella skillnaden mellan range och högsta
        //färglägger bakgrunden
        ctx.clearRect(0, 0, window.innerWidth,window.innerHeight);
        ctx.fillStyle = '#ffd38b'; 
        ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
    //******************************************************************************
    //rita ut prislinje
        var pris;
        pris=range[0]*0.10;
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
        //rita ut nuvarande pris
        ctx.font = "15px Arial";
        ctx.beginPath();
        ctx.lineWidth=1;
        ctx.strokeStyle = '#000075';
        ctx.moveTo(0,ch-(close[0]*hojd));//startpunkt x,y
        ctx.lineTo(1250,ch-(close[0]*hojd));
        num=close[0];
        pristext=num.toFixed(2);
        ctx.fillStyle = '#000095';
        ctx.fillText(pristext, 40, ch-(close[0]*hojd)+14);
        ctx.stroke();
    }
    ctx.setLineDash([]);
    //rita ut candlesticks*********************************************************
    for (i = aktivArrayStorlek; i > 0 ; i-- ){						
        utr=aktivArrayStorlek-i;
    
    if (open[utr]>close[utr]) 	{				//BEARcandle
            //Rita kropp           
            ctx.lineWidth=1;
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(i*avstand+bredd,ch-open[utr]*hojd,bredd,open[utr]*hojd-close[utr]*hojd);			
            //Rita veke ovanför
            ctx.beginPath();
            //ctx.setLineDash([]);
            ctx.lineWidth=2;
            ctx.strokeStyle ='#000000';
            ctx.moveTo(i*avstand+bredd+(bredd/2),ch-open[utr]*hojd);//startpunkt x,y
            ctx.lineTo((i*avstand+bredd)+(bredd/2),(ch-(open[utr]*hojd))+(ch-(high[utr]*hojd))-(ch-(open[utr]*hojd)));
            ctx.stroke();
            //Rita veke under
            ctx.beginPath();
            //ctx.setLineDash([]);
            ctx.lineWidth=2;
            ctx.strokeStyle ="#000000";
            ctx.moveTo(i*avstand+bredd+(bredd/2),ch-low[utr]*hojd);
            ctx.lineTo(i*avstand+bredd+(bredd/2),ch-close[utr]*hojd);
            ctx.stroke();
    }
    if (close[utr]>open[utr]) 	{				//BULLcandle
    
        //Rita kropp
        ctx.lineWidth=1;
        ctx.fillStyle = "#009900";
        ctx.fillRect(i*avstand+bredd,ch-(close[utr]*hojd),bredd,close[utr]*hojd-open[utr]*hojd);//(startpunkt x,y),bredd,höjd						
        //veke ovanför
        ctx.beginPath();
        //ctx.setLineDash([]);
        ctx.lineWidth=2;
        ctx.strokeStyle ="#000000";
        ctx.moveTo(i*avstand+bredd+(bredd/2),ch-(close[utr]*hojd));
        ctx.lineTo(i*avstand+bredd+(bredd/2),ch-(close[utr]*hojd)+(ch-(high[utr]*hojd))-(ch-(close[utr]*hojd)));
        ctx.stroke();
        //veke under
        ctx.beginPath();
        //ctx.setLineDash([]);
        ctx.strokeStyle ="#000000";
        ctx.lineWidth=2;
        ctx.moveTo(i*avstand+bredd+(bredd/2),ch-open[utr]*hojd);
        ctx.lineTo(i*avstand+bredd+(bredd/2),ch-low[utr]*hojd);
        ctx.stroke();
    }
    if (close[utr]==open[utr]) 	{				//Doji
    
        //Rita kropp
        ctx.lineWidth=1;
        ctx.fillStyle ="#000000";
        //ctx.setLineDash([]);
        ctx.moveTo(i*avstand+bredd,ch-close[utr]*hojd);
        ctx.lineTo(i*avstand+bredd+bredd,ch-close[utr]*hojd);
        ctx.stroke();
        //veke ovanför
        ctx.beginPath();
        //ctx.setLineDash([]);
        ctx.lineWidth=2;
        ctx.strokeStyle ="#000000";
        ctx.moveTo(i*avstand+bredd+(bredd/2),ch-close[utr]*hojd);
        ctx.lineTo(i*avstand+bredd+(bredd/2),ch-(close[utr]*hojd)+(ch-(high[utr]*hojd))-(ch-(close[utr]*hojd)));
        ctx.stroke();
        //veke under
        ctx.beginPath();
        //ctx.setLineDash([]);
        ctx.lineWidth=2;
        ctx.strokeStyle ="#000000";
        ctx.moveTo(i*avstand+bredd+(bredd/2),ch-open[utr]*hojd);
        ctx.lineTo(i*avstand+bredd+(bredd/2),ch-low[utr]*hojd);
        ctx.stroke();				                               
    }
    } 
    }