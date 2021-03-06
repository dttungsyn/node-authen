/**
 * version 2.1.11
 * @license
 * =========================================================
 * bootstrap-datetimepicker.js
 * http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Copyright 2012 Stefan Petre
 *
 * Contributions:
 * - updated for Bootstrap v3 by Jonathan Peterson (@Eonasdan) and (almost)
 *    completely rewritten to use Momentjs
 * - based on tarruda's bootstrap-datepicker
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================
 */
(function(d){var c=0,a=moment,b=function(g,i){var s={pickDate:true,pickTime:true,startDate:new a({y:1970}),endDate:new a().add(50,"y"),collapse:true,language:"en",defaultDate:"",disabledDates:[],icons:{},useStrict:false},K={time:"glyphicon glyphicon-time",date:"glyphicon glyphicon-calendar",up:"glyphicon glyphicon-chevron-up",down:"glyphicon glyphicon-chevron-down"},q=this,E=function(){var O=false,N,P,M;q.options=d.extend({},s,i);q.options.icons=d.extend({},K,q.options.icons);if(!(q.options.pickTime||q.options.pickDate)){throw new Error("Must choose at least one picker")}q.id=c++;a.lang(q.options.language);q.date=a();q.element=d(g);q.unset=false;q.isInput=q.element.is("input");q.component=false;if(q.element.hasClass("input-group")){if(q.element.find(".datepickerbutton").size()==0){q.component=q.element.find(".input-group-addon")}else{q.component=q.element.find(".datepickerbutton")}}q.format=q.options.format;M=a()._lang._longDateFormat;if(!q.format){if(q.isInput){q.format=q.element.data("format")}else{q.format=q.element.find("input").data("format")}if(!q.format){q.format=(q.options.pickDate?M.L:"");if(q.options.pickDate&&q.options.pickTime){q.format+=" "}q.format+=(q.options.pickTime?M.LT:"")}}q.use24hours=q.format.toLowerCase().indexOf("a")<1;if(q.component){O=q.component.find("span")}if(q.options.pickTime){if(O){O.addClass(q.options.icons.time)}}if(q.options.pickDate){if(O){O.removeClass(q.options.icons.time);O.addClass(q.options.icons.date)}}q.widget=d(I(q.options.pickDate,q.options.pickTime,q.options.collapse)).appendTo("body");q.minViewMode=q.options.minViewMode||q.element.data("date-minviewmode")||0;if(typeof q.minViewMode==="string"){switch(q.minViewMode){case"months":q.minViewMode=1;break;case"years":q.minViewMode=2;break;default:q.minViewMode=0;break}}q.viewMode=q.options.viewMode||q.element.data("date-viewmode")||0;if(typeof q.viewMode==="string"){switch(q.viewMode){case"months":q.viewMode=1;break;case"years":q.viewMode=2;break;default:q.viewMode=0;break}}for(N=0;N<q.options.disabledDates.length;N++){P=q.options.disabledDates[N];P=a(P);if(!P.isValid()){P=a(q.options.startDate).subtract(1,"day")}q.options.disabledDates[N]=P.format("L")}q.startViewMode=q.viewMode;q.setStartDate(q.options.startDate||q.element.data("date-startdate"));q.setEndDate(q.options.endDate||q.element.data("date-enddate"));H();L();l();C();n();f();J();if(q.options.defaultDate!==""){q.setValue(q.options.defaultDate)}},o=function(){var M="absolute",O=q.component?q.component.offset():q.element.offset(),N=d(window);q.width=q.component?q.component.outerWidth():q.element.outerWidth();O.top=O.top+q.element.outerHeight();if(q.options.width!==undefined){q.widget.width(q.options.width)}if(q.options.orientation==="left"){q.widget.addClass("left-oriented");O.left=O.left-q.widget.width()+20}if(A()){M="fixed";O.top-=N.scrollTop();O.left-=N.scrollLeft()}if(N.width()<O.left+q.widget.outerWidth()){O.right=N.width()-O.left-q.width;O.left="auto";q.widget.addClass("pull-right")}else{O.right="auto";q.widget.removeClass("pull-right")}q.widget.css({position:M,top:O.top,left:O.left,right:O.right})},z=function(M){q.element.trigger({type:"change.dp",date:q.getDate(),oldDate:M})},w=function(M){q.element.trigger({type:"error.dp",date:M})},n=function(M){a.lang(q.options.language);var N=M;if(!N){if(q.isInput){N=q.element.val()}else{N=q.element.find("input").val()}if(N){q.date=a(N,q.format,q.options.useStrict)}if(!q.date){q.date=a()}}q.viewDate=a(q.date).startOf("month");h();y()},H=function(){a.lang(q.options.language);var O=d("<tr>"),M=a.weekdaysMin(),N;if(a()._lang._week.dow==0){for(N=0;N<7;N++){O.append('<th class="dow">'+M[N]+"</th>")}}else{for(N=1;N<8;N++){if(N==7){O.append('<th class="dow">'+M[0]+"</th>")}else{O.append('<th class="dow">'+M[N]+"</th>")}}}q.widget.find(".datepicker-days thead").append(O)},L=function(){a.lang(q.options.language);var N="",M=0,O=a.monthsShort();while(M<12){N+='<span class="month">'+O[M++]+"</span>"}q.widget.find(".datepicker-months td").append(N)},h=function(){a.lang(q.options.language);var X=q.viewDate.year(),V=q.viewDate.month(),W=q.options.startDate.year(),Z=q.options.startDate.month(),aa=q.options.endDate.year(),T=q.options.endDate.month(),P,S,R=[],ab,O,Q,Y,N,U,M=a.months();q.widget.find(".datepicker-days").find(".disabled").removeClass("disabled");q.widget.find(".datepicker-months").find(".disabled").removeClass("disabled");q.widget.find(".datepicker-years").find(".disabled").removeClass("disabled");q.widget.find(".datepicker-days th:eq(1)").text(M[V]+" "+X);P=a(q.viewDate).subtract("months",1);Y=P.daysInMonth();P.date(Y).startOf("week");if((X==W&&V<=Z)||X<W){q.widget.find(".datepicker-days th:eq(0)").addClass("disabled")}if((X==aa&&V>=T)||X>aa){q.widget.find(".datepicker-days th:eq(2)").addClass("disabled")}S=a(P).add(42,"d");while(P.isBefore(S)){if(P.weekday()===a().startOf("week").weekday()){ab=d("<tr>");R.push(ab)}O="";if(P.year()<X||(P.year()==X&&P.month()<V)){O+=" old"}else{if(P.year()>X||(P.year()==X&&P.month()>V)){O+=" new"}}if(P.isSame(a({y:q.date.year(),M:q.date.month(),d:q.date.date()}))){O+=" active"}if((a(P).add(1,"d")<=q.options.startDate)||(P>q.options.endDate)||e(P)){O+=" disabled"}ab.append('<td class="day'+O+'">'+P.date()+"</td>");P.add(1,"d")}q.widget.find(".datepicker-days tbody").empty().append(R);U=a().year(),M=q.widget.find(".datepicker-months").find("th:eq(1)").text(X).end().find("span").removeClass("active");if(U===X){M.eq(a().month()).addClass("active")}if(U-1<W){q.widget.find(".datepicker-months th:eq(0)").addClass("disabled")}if(U+1>aa){q.widget.find(".datepicker-months th:eq(2)").addClass("disabled")}for(Q=0;Q<12;Q++){if((X==W&&Z>Q)||(X<W)){d(M[Q]).addClass("disabled")}else{if((X==aa&&T<Q)||(X>aa)){d(M[Q]).addClass("disabled")}}}R="";X=parseInt(X/10,10)*10;N=q.widget.find(".datepicker-years").find("th:eq(1)").text(X+"-"+(X+9)).end().find("td");q.widget.find(".datepicker-years").find("th").removeClass("disabled");if(W>X){q.widget.find(".datepicker-years").find("th:eq(0)").addClass("disabled")}if(aa<X+9){q.widget.find(".datepicker-years").find("th:eq(2)").addClass("disabled")}X-=1;for(Q=-1;Q<11;Q++){R+='<span class="year'+(Q===-1||Q===10?" old":"")+(U===X?" active":"")+((X<W||X>aa)?" disabled":"")+'">'+X+"</span>";X+=1}N.html(R)},l=function(){a.lang(q.options.language);var P=q.widget.find(".timepicker .timepicker-hours table"),O="",Q,N,M;P.parent().hide();if(q.use24hours){Q=0;for(N=0;N<6;N+=1){O+="<tr>";for(M=0;M<4;M+=1){O+='<td class="hour">'+D(Q.toString())+"</td>";Q++}O+="</tr>"}}else{Q=1;for(N=0;N<3;N+=1){O+="<tr>";for(M=0;M<4;M+=1){O+='<td class="hour">'+D(Q.toString())+"</td>";Q++}O+="</tr>"}}P.html(O)},C=function(){var P=q.widget.find(".timepicker .timepicker-minutes table"),O="",Q=0,N,M;P.parent().hide();for(N=0;N<5;N++){O+="<tr>";for(M=0;M<4;M+=1){O+='<td class="minute">'+D(Q.toString())+"</td>";Q+=3}O+="</tr>"}P.html(O)},y=function(){if(!q.date){return}var O=q.widget.find(".timepicker span[data-time-component]"),M=q.date.hours(),N="AM";if(!q.use24hours){if(M>=12){N="PM"}if(M===0){M=12}else{if(M!=12){M=M%12}}q.widget.find(".timepicker [data-action=togglePeriod]").text(N)}O.filter("[data-time-component=hours]").text(D(M));O.filter("[data-time-component=minutes]").text(D(q.date.minutes()))},B=function(S){S.stopPropagation();S.preventDefault();q.unset=false;var R=d(S.target).closest("span, td, th"),Q,O,P,M,N=q.date;if(R.length===1){if(!R.is(".disabled")){switch(R[0].nodeName.toLowerCase()){case"th":switch(R[0].className){case"switch":f(1);break;case"prev":case"next":P=G.modes[q.viewMode].navStep;if(R[0].className==="prev"){P=P*-1}q.viewDate.add(P,G.modes[q.viewMode].navFnc);h();break}break;case"span":if(R.is(".month")){Q=R.parent().find("span").index(R);q.viewDate.month(Q)}else{O=parseInt(R.text(),10)||0;q.viewDate.year(O)}if(q.viewMode!==0){q.date=a({y:q.viewDate.year(),M:q.viewDate.month(),d:q.viewDate.date(),h:q.date.hours(),m:q.date.minutes()});z(N)}f(-1);h();break;case"td":if(R.is(".day")){M=parseInt(R.text(),10)||1;Q=q.viewDate.month();O=q.viewDate.year();if(R.is(".old")){if(Q===0){Q=11;O-=1}else{Q-=1}}else{if(R.is(".new")){if(Q==11){Q=0;O+=1}else{Q+=1}}}q.date=a({y:O,M:Q,d:M,h:q.date.hours(),m:q.date.minutes()});q.viewDate=a({y:O,M:Q,d:Math.min(28,M)});h();x();z(N)}break}}}},r={incrementHours:function(){j("add","hours")},incrementMinutes:function(){j("add","minutes")},decrementHours:function(){j("subtract","hours")},decrementMinutes:function(){j("subtract","minutes")},togglePeriod:function(){var M=q.date.hours();if(M>=12){M-=12}else{M+=12}q.date.hours(M)},showPicker:function(){q.widget.find(".timepicker > div:not(.timepicker-picker)").hide();q.widget.find(".timepicker .timepicker-picker").show()},showHours:function(){q.widget.find(".timepicker .timepicker-picker").hide();q.widget.find(".timepicker .timepicker-hours").show()},showMinutes:function(){q.widget.find(".timepicker .timepicker-picker").hide();q.widget.find(".timepicker .timepicker-minutes").show()},selectHour:function(M){q.date.hours(parseInt(d(M.target).text(),10));r.showPicker.call(q)},selectMinute:function(M){q.date.minutes(parseInt(d(M.target).text(),10));r.showPicker.call(q)}},v=function(O){var N=d(O.currentTarget).data("action"),P=r[N].apply(q,arguments),M=q.date;F(O);if(!q.date){q.date=a({y:1970})}x();y();z(M);return P},F=function(M){M.stopPropagation();M.preventDefault()},u=function(O){a.lang(q.options.language);var M=d(O.target),N=q.date,P=a(M.val(),q.format,q.options.useStrict);if(P.isValid()){n();q.setValue(P);z(N);x()}else{q.viewDate=N;z(N);w(P);q.unset=true;M.val("")}},f=function(M){if(M){q.viewMode=Math.max(q.minViewMode,Math.min(2,q.viewMode+M))}q.widget.find(".datepicker > div").hide().filter(".datepicker-"+G.modes[q.viewMode].clsName).show()},J=function(){var Q,P,N,M,O;q.widget.on("click",".datepicker *",d.proxy(B,this));q.widget.on("click","[data-action]",d.proxy(v,this));q.widget.on("mousedown",d.proxy(F,this));if(q.options.pickDate&&q.options.pickTime){q.widget.on("click.togglePicker",".accordion-toggle",function(R){R.stopPropagation();Q=d(this);P=Q.closest("ul");N=P.find(".in");M=P.find(".collapse:not(.in)");if(N&&N.length){O=N.data("collapse");if(O&&O.transitioning){return}N.collapse("hide");M.collapse("show");Q.find("span").toggleClass(q.options.icons.time+" "+q.options.icons.date);q.element.find(".input-group-addon span").toggleClass(q.options.icons.time+" "+q.options.icons.date)}})}if(q.isInput){q.element.on({focus:d.proxy(q.show,this),change:d.proxy(u,this),blur:d.proxy(q.hide,this)})}else{q.element.on({change:d.proxy(u,this)},"input");if(q.component){q.component.on("click",d.proxy(q.show,this))}else{q.element.on("click",d.proxy(q.show,this))}}},p=function(){d(window).on("resize.datetimepicker"+q.id,d.proxy(o,this));if(!q.isInput){d(document).on("mousedown.datetimepicker"+q.id,d.proxy(q.hide,this))}},t=function(){q.widget.off("click",".datepicker *",q.click);q.widget.off("click","[data-action]");q.widget.off("mousedown",q.stopEvent);if(q.options.pickDate&&q.options.pickTime){q.widget.off("click.togglePicker")}if(q.isInput){q.element.off({focus:q.show,change:q.change})}else{q.element.off({change:q.change},"input");if(q.component){q.component.off("click",q.show)}else{q.element.off("click",q.show)}}},k=function(){d(window).off("resize.datetimepicker"+q.id);if(!q.isInput){d(document).off("mousedown.datetimepicker"+q.id)}},A=function(){if(q.element){var N=q.element.parents(),M=false,O;for(O=0;O<N.length;O++){if(d(N[O]).css("position")=="fixed"){M=true;break}}return M}else{return false}},x=function(){a.lang(q.options.language);var N="",M;if(!q.unset){N=a(q.date).format(q.format)}if(!q.isInput){if(q.component){M=q.element.find("input");M.val(N)}q.element.data("date",N)}else{q.element.val(N)}if(!q.options.pickTime){q.hide()}},j=function(O,N){a.lang(q.options.language);var M;if(O=="add"){M=a(q.date);if(M.hours()==23){M.add(1,N)}M.add(1,N)}else{M=a(q.date).subtract(1,N)}if(M.isAfter(q.options.endDate)||M.subtract(1,N).isBefore(q.options.startDate)||e(M)){w(M.format(q.format));return}if(O=="add"){q.date.add(1,N)}else{q.date.subtract(1,N)}},e=function(M){a.lang(q.options.language);var O=q.options.disabledDates,N;for(N in O){if(O[N]==a(M).format("L")){return true}}return false},D=function(M){M=M.toString();if(M.length>=2){return M}else{return"0"+M}},I=function(N,M,O){if(N&&M){return('<div class="bootstrap-datetimepicker-widget dropdown-menu" style="z-index:9999 !important;"><ul class="list-unstyled"><li'+(O?' class="collapse in"':"")+'><div class="datepicker">'+G.template+'</div></li><li class="picker-switch accordion-toggle"><a class="btn" style="width:100%"><span class="'+q.options.icons.time+'"></span></a></li><li'+(O?' class="collapse"':"")+'><div class="timepicker">'+m.getTemplate()+"</div></li></ul></div>")}else{if(M){return('<div class="bootstrap-datetimepicker-widget dropdown-menu"><div class="timepicker">'+m.getTemplate()+"</div></div>")}else{return('<div class="bootstrap-datetimepicker-widget dropdown-menu"><div class="datepicker">'+G.template+"</div></div>")}}},G={modes:[{clsName:"days",navFnc:"month",navStep:1},{clsName:"months",navFnc:"year",navStep:1},{clsName:"years",navFnc:"year",navStep:10}],headTemplate:'<thead><tr><th class="prev">&lsaquo;</th><th colspan="5" class="switch"></th><th class="next">&rsaquo;</th></tr></thead>',contTemplate:'<tbody><tr><td colspan="7"></td></tr></tbody>'},m={hourTemplate:'<span data-action="showHours" data-time-component="hours" class="timepicker-hour"></span>',minuteTemplate:'<span data-action="showMinutes" data-time-component="minutes" class="timepicker-minute"></span>'};G.template='<div class="datepicker-days"><table class="table-condensed">'+G.headTemplate+'<tbody></tbody></table></div><div class="datepicker-months"><table class="table-condensed">'+G.headTemplate+G.contTemplate+'</table></div><div class="datepicker-years"><table class="table-condensed">'+G.headTemplate+G.contTemplate+"</table></div>";m.getTemplate=function(){return('<div class="timepicker-picker"><table class="table-condensed"><tr><td><a href="#" class="btn" data-action="incrementHours"><span class="'+q.options.icons.up+'"></span></a></td><td class="separator"></td><td><a href="#" class="btn" data-action="incrementMinutes"><span class="'+q.options.icons.up+'"></span></a></td>'+(!q.use24hours?'<td class="separator"></td>':"")+"</tr><tr><td>"+m.hourTemplate+'</td> <td class="separator">:</td><td>'+m.minuteTemplate+"</td> "+(!q.use24hours?'<td class="separator"></td><td><button type="button" class="btn btn-primary" data-action="togglePeriod"></button></td>':"")+'</tr><tr><td><a href="#" class="btn" data-action="decrementHours"><span class="'+q.options.icons.down+'"></span></a></td><td class="separator"></td><td><a href="#" class="btn" data-action="decrementMinutes"><span class="'+q.options.icons.down+'"></span></a></td>'+(!q.use24hours?'<td class="separator"></td>':"")+'</tr></table></div><div class="timepicker-hours" data-action="selectHour"><table class="table-condensed"></table></div><div class="timepicker-minutes" data-action="selectMinute"><table class="table-condensed"></table></div>')};q.destroy=function(){t();k();q.widget.remove();q.element.removeData("DateTimePicker");q.component.removeData("DateTimePicker")};q.show=function(M){q.widget.show();q.height=q.component?q.component.outerHeight():q.element.outerHeight();o();q.element.trigger({type:"show.dp",date:q.date});p();if(M){F(M)}},q.disable=function(){q.element.find("input").prop("disabled",true);t()},q.enable=function(){q.element.find("input").prop("disabled",false);J()},q.hide=function(){var O=q.widget.find(".collapse"),M,N;for(M=0;M<O.length;M++){N=O.eq(M).data("collapse");if(N&&N.transitioning){return}}q.widget.hide();q.viewMode=q.startViewMode;f();q.element.trigger({type:"hide.dp",date:q.date});k()},q.setValue=function(M){a.lang(q.options.language);if(!M){q.unset=true}else{q.unset=false}if(!a.isMoment(M)){M=a(M)}if(M.isValid()){q.date=M;x();q.viewDate=a({y:q.date.year(),M:q.date.month()});h();y()}else{w(M)}},q.getDate=function(){if(q.unset){return null}return q.date},q.setDate=function(M){if(!M){q.setValue(null)}else{q.setValue(M)}},q.setEndDate=function(M){q.options.endDate=a(M);if(!q.options.endDate.isValid()){q.options.endDate=a().add(50,"y")}if(q.viewDate){n()}},q.setStartDate=function(M){q.options.startDate=a(M);if(!q.options.startDate.isValid()){q.options.startDate=a({y:1970})}if(q.viewDate){n()}};E()};d.fn.datetimepicker=function(e){return this.each(function(){var g=d(this),f=g.data("DateTimePicker");if(!f){g.data("DateTimePicker",new b(this,e))}})}})(jQuery);
var dp;

dp = angular.module('ng-bootstrap3-datepicker', []);

dp.directive('datepicker', function($compile) {
  return {
    restrict: 'E',
    replace: true,
    template: "<div class='input-group date'>\n  <input type='text' class='form-control'/>\n  <span class='input-group-addon'>\n    <span class='fa fa-calendar'></span>\n  </span>\n</div>",
    link: function($scope, element, attr) {
      var attributes, dateFormat, input, resetValue;
      dateFormat = "";
      attributes = element.prop("attributes");
      input = element.find("input");
      resetValue = false;
      angular.forEach(attributes, function(e) {
        if (e.name !== "class") {
          input.attr(e.name, e.value);
        }
        if (e.name === "date-format") {
          return dateFormat = e.value;
        }
      });
      $scope.$watch(attr.language, function(value) {
        var language;
        language = value ? value : input.attr('language');
        return input.datetimepicker({
          language: language,
          pickTime: false,
          dateFormat: dateFormat,
          icons: {
            time: 'fa fa-clock-o',
            date: 'fa fa-calendar',
            up: 'fa fa-arrow-up',
            down: 'fa fa-arrow-down'
          }
        });
      });
      element.find('.input-group-addon').on('click', function(e) {
        return element.find('input').focus();
      });
      element.on("change.dp", function(e) {
        return $scope.$apply(function() {
          var i, obj, objPath, path, _i, _len, _results;
          if (e.date) {
            objPath = attr.ngModel.split(".");
            obj = $scope;
            _results = [];
            for (i = _i = 0, _len = objPath.length; _i < _len; i = ++_i) {
              path = objPath[i];
              if (!obj[path]) {
                obj[path] = {};
              }
              if (i === objPath.length - 1) {
                if (resetValue) {
                  resetValue = false;
                  _results.push(obj[path] = null);
                } else {
                  _results.push(obj[path] = e.date.format(dateFormat));
                }
              } else {
                _results.push(obj = obj[path]);
              }
            }
            return _results;
          }
        });
      });
      $scope.$watch(attr.ngModel, function(newValue, oldValue) {
        if (oldValue && !newValue) {
          return resetValue = true;
        }
      });
      return $compile(input)($scope);
    }
  };
});
