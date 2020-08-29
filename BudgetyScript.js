var BudgetController = (function(){

    var Income=function(id,desc,value){
        this.id=id;
        this.desc=desc;
        this.value=value;
    };
    var Expense=function(id,desc,value){
        this.id=id;
        this.desc=desc;
        this.value=value;
        this.percentage=-1;
    };
    Expense.prototype.calPercentage=function (totalIncome) {
        if(totalIncome>0){
            this.percentage=Math.round((this.value/totalIncome)*100);
        }
        else{
            this.percentage=-1;
        }
        console.log(this.percentage,totalIncome);
        return this.percentage;
    };
    var calcualteTotal=function(type){
        var i=0,sum=0,IncExp;
        IncExp=data.allItems[type];//income or expense
        for(i=0;i<IncExp.length;i++){
            sum=sum + IncExp[i].value;
        }
        data.totals[type]=sum;//now total is sum of income/expense calaculated above
    };
    
    var data={
        //arrays containg expense and income list
        allItems:{
            Expense:[],
            Income:[]
        },
        //total expense and income
        totals:{
            Expense:0,
            Income:0
        },
        //budget by subtracting expense from income
        budget:0,
        //percentage of expense spent on income
        percentage:0,
        ExpPercentage:0
    };
    return{
        //add newly created item to array (Expense or Income)
        addItem:function(type,desc,value){
            var newItem,ID;
            if(data.allItems[type].length>0){
                //it assigns id to all the incomes and expenses i.e id=income[3].id+1
                ID=data.allItems[type][data.allItems[type].length-1].id+1;
            }
            else{
                ID=0;
            }
            
            if(type=='Income'){
                ID=ID+1;
                newItem=new Income(ID,desc,value);
            }
            else if(type=='Expense'){
                ID=ID+1;
                newItem=new Expense(ID,desc,value);
            }
            data.allItems[type].push(newItem);
            return newItem;
        },
        deleteItem:function(Id,type){
            var i,ElementOfArray;
            ElementOfArray=data.allItems[type];
             for(i=0;i<ElementOfArray.length;i++){
                 if(ElementOfArray[i].id==Id){
                    ElementOfArray.splice(i,1);//delete the element at index i and delete  only one element
                 }
             }

        },
        calculateBudget:function(){
            //calculate total income and expenses
            calcualteTotal('Income');
            calcualteTotal('Expense');
            //calculate the budget income-expenses
            data.budget=data.totals.Income - data.totals.Expense;
            //calcualte the percentage of income that we spent
            if(data.totals.Income > 0){
                data.percentage= Math.round((data.totals.Expense / data.totals.Income)*100);
            }
            else{
                data.percentage=0;
            }
            console.log('percent'+data.percentage);
        },
        getBudget:function(){
            return{
                budget:data.budget,
                totalInc:data.totals.Income,
                totalExp:data.totals.Expense,
                percentage:data.percentage
            };
        }

    }
    
})();

 var UIcontroller = (function(){
     //It object has the names of all css classes used in script
     var CssClasses={
        inpType:'.selectionBox',
        inpDesc:'.Inpdecs',
        inpValue:'.Value',
        AddBtn:'.add_Btn',
        IncomeContainer:'income_list',
        ExpenseConatiner:'expense_list',
        budget:'.TotalBudget',
        TIncAmount:'.IncomeAmount',
        TExpAmount:'.ExpenseAmount',
        TExpPercentage:'TExpPercent',
        container:'.container'

     };
     return {
         //Thsi functin gets input from inp panels
         getInput:function()
         {
             return{
                type:document.querySelector(CssClasses.inpType).value,
                description:document.querySelector(CssClasses.inpDesc).value,
                value:parseFloat(document.querySelector(CssClasses.inpValue).value)
             };
        },
        addListItem:function(obj,type,bgt){
            //create HTML string with placeHolder classes

            var html,newHtml,element;
            if(type=='Income'){
            element=CssClasses.IncomeContainer;
            html='<h5><li class="list-group-item d-flex p-0 justify-content-between align-items-center" id="Income-%id%" style="margin-top:0%;padding:0%;background-color:#f5f5f5;">%desc%<span class="badge badge-info">+%value%</span><div><button class="btn btn-outline-danger btn-circle btn-sm" type="button">X</button></div></li></h5><hr>';
            }
            else if(type=='Expense'){
            element=CssClasses.ExpenseConatiner;
            html='<h5><li class="list-group-item d-flex justify-content-between align-items-center" id="Expense-%id%" style="margin-top:0%;padding:0%;background-color:#f5f5f5;>%desc%<span class="badge badge-danger">-%value%</span><div><span class="badge badge-warning" style="font-size: small;">%percent%</span><button class="btn btn-outline-danger btn-circle btn-sm ml-sm-4" type="button">X</button></div></li></h5><hr>';
            }
            //replace the placeholder text with some actual data
            console.log(obj.desc);
            newHtml=html.replace('%id%',obj.id);
            newHtml=newHtml.replace('%desc%',obj.desc);
            newHtml=newHtml.replace('%value%',obj.value);
            if(type=='Expense'){
                var percent=obj.calPercentage(bgt.totalInc);
                newHtml=newHtml.replace('%percent%',percent+'%');
            }
            
            //Insert the html into the DOM
            document.getElementById(element).insertAdjacentHTML('beforeend',newHtml);
        },
        clearFields:function(){
            //document.querySelector(CssClasses.inpType).style.='+ / -';
            document.querySelector(CssClasses.inpValue).value='';
            document.querySelector(CssClasses.inpDesc).value='';
        },
        displayBudget:function(obj){
            document.querySelector(CssClasses.budget).textContent='+'+obj.budget;
            document.querySelector(CssClasses.TIncAmount).textContent=obj.totalInc;
            document.querySelector(CssClasses.TExpAmount).textContent=obj.totalExp;
            if(obj.percentage>=0){
                document.getElementById(CssClasses.TExpPercentage).textContent=obj.percentage+'%';
            }
            else{
                document.getElementById(CssClasses.TExpPercentage).textContent='--%';
            }
            
        },
        deleteElement:function (SelectorId) {
            var element=document.getElementById(SelectorId);
            element.parentNode.removeChild(element);
        },
        //This function gets css classes and returns it to controoler module because we cannot get it directly in private function 
        getCssClasses:function(){
             return CssClasses;
             }

        };

 })();

 var controller = (function(BgtCtrl,UiCtrl){
    var input,newItem,budget;
    var updateBudget=function(){
        //1.Calculate the budget
        BgtCtrl.calculateBudget();
        //2.return the budget
        budget=BgtCtrl.getBudget();
        //3.Add the budget to UI
        UiCtrl.displayBudget(budget);
    }
     //GET input from UI CONTROLLER
     var ctrlAddItem=function(){
         //1.get Input from user
         input=UiCtrl.getInput();
        console.log(input);
        //2.Add item to budget controller
        if(input.type!="" &&  input.value!=" " && input.description!="" ) {
            console.log('inside'+input);
         newItem = BgtCtrl.addItem(input.type,input.description,input.value);
        //3.Add item to UI
        UiCtrl.addListItem(newItem,input.type,budget);
        //clear fields
        UiCtrl.clearFields();
        //4.Calculate the budget
        updateBudget();
        }
     }
     //delete an item from list
     var ctrlDeleteItem=function(event){
         var itemId,splitId,type,Id;
        console.log(event.target.parentNode.parentNode.id);
         itemId=event.target.parentNode.parentNode.id;
         if(itemId){
            splitId=itemId.split('-');
            type=splitId[0];
            Id=parseInt(splitId[1]);
            //1.delete the item from data structure
            BgtCtrl.deleteItem(Id,type);
            //2.delete the item from the UI
            UiCtrl.deleteElement(itemId);
            //3.update and show the new budget
            updateBudget();
         }
         
     }
     //ALL Event listeners are in this function
     var setUpEventListeners=function(){
        var CssClasses=UiCtrl.getCssClasses();
        
        document.querySelector(CssClasses.AddBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function(event){
         if(event.keyCode===13 || event.which===13){
             ctrlAddItem();
         }
     });
        document.querySelector(CssClasses.container).addEventListener('click',ctrlDeleteItem);
    };
    return{
        init:function(){
        console.log("App has started")   
        setUpEventListeners(); 
        }
    }

 })(BudgetController,UIcontroller);

 controller.init();
