            var rslts;
            /*
              This function disables the form so that I don't have anyone adding anything into it.
              Hence, when first getting a record, I don't want to have edits to the fields so that
              they know what was there if they need to print or verify the information.
              This will also enable the form and reset the fields to blank for a new data entry.
            */
            function DisableForm(myForm, cond, reset)
            {
                var Frm = document.getElementById(myForm);

                var node_list = Frm.getElementsByTagName('input');
                for (var i = 0; i < node_list.length; i++)
                {
                    var node = node_list[i];
                    if (node.getAttribute('type') == 'checkbox' || node.getAttribute('type') == 'submit')
                    {
                        node.disabled = cond;
                    }
                    else { node.readOnly = cond; }
                    if (reset & node.getAttribute('type') != 'submit' & node.id != 'prtbtn' & node.name != 'table') { node.innerHTML = ''; node.value = ''; };

                }

                var node_list = Frm.getElementsByTagName('textarea');
                for (var i = 0; i < node_list.length; i++)
                {
                    if (reset) { node_list[i].innerHTML = ''; node_list[i].value = ''; };
                    node_list[i].disabled = cond;
                }



            };
            /*
              This will init the form for a new entry.
            */
            function newObj()
            {
                document.getElementById("rowid").value = 0;
                DisableForm("Input", false, true);

            }
            /*
              Resets the form for editing.
            */
            function editObj()
            {
                if (document.getElementById("rowid").value) { DisableForm('Input', false, false); } else { newObj(); };
            }
            /*
              This is for deleting the row.
            */
            function delObj()
            {
                if (document.getElementById("rowid").value != 0)
                {

                    if (confirm('Do you really want to delete this?'))
                    {
                        $.ajax({
                            type: "POST",
                            url: "/Report/FormHandler",
                            data: { "rowid": document.getElementById("rowid").value, "table": "GenDel", "Seltable": document.getElementById("table").value },
                            dataType: "json",

                            success: function (msg)
                            {

                                $("#formResponse").removeClass('error');
                                $("#formResponse").removeClass('success');
                                $("#formResponse").removeClass('success2');
                                $("#formResponse").addClass(msg[0].status);
                                $("#formResponse").html(msg[0].message);
                                $("#formResponse").css("display", "inherit");
                                $("#formResponse").fadeOut(2000);
                                newObj();
                            },
                            error: function ()
                            {
                                $("#formResponse").removeClass('success');
                                $("#formResponse").removeClass('success2');
                                $("#formResponse").addClass('error');
                                $("#formResponse").html("There was an error deleting the row. Please try again.");
                            }
                        });

                    }

                }
            }
            /*
              Opens the list to search for whatever.
            */
            function openlist()
            {
                DisableForm("Input", true, false);
                document.getElementById("grayarea").removeAttribute("class", "hidemeall");
                document.getElementById("ObjList").removeAttribute("class", "hidemeall");
                document.getElementById("grayarea").setAttribute("class", "HideAll");
                $("#formResponse").html("");
                getList(false);

            }
            /*
              Once selected, this will load the specific values of that one row selected by rowID.  
            */
            function loaditem(getnumber)
            {
                hidegrayarea();
                $.ajax({
                    type: "POST",
                    url: "/Report/FormHandler",
                    data: { "getnumber": getnumber, "table": document.getElementById("table").value },
                    dataType: "json",

                    success: function (msg)
                    {

                        $("#formResponse").removeClass('error');
                        $("#formResponse").removeClass('success');
                        /*
                        $("#formResponse").addClass(msg[0].status);
                        $("#formResponse").html(msg[0].message);
                        $("#formResponse").fadeOut(2000);
                        */
                        var d = new Date;
                        var itm;
                        rslts = msg;

                        var id = 0;

                        for (var x in rslts[id])
                        {
                            itm = document.getElementById(x);
                            if (rslts[id][x] == null) { rslts[id][x] = ''; };
                            if (rslts[id][x] == 'null') { rslts[id][x] = ''; };
                            if (rslts[id][x] == '') { rslts[id][x] = ''; };
                            if (itm) { itm.innerHTML = rslts[id][x]; itm.value = rslts[id][x]; itm.enabled = false; };

                        };
                    },
                    error: function ()
                    {
                        $("#formResponse").removeClass('success');
                        $("#formResponse").addClass('error');
                        $("#formResponse").html("There was an error submitting the form. Please try again.");
                    }
                });


                return false;

            }
            /*
              Hide the gray shadow that covers the background.  
            */
            function hidegrayarea()
            {
                document.getElementById("grayarea").removeAttribute("class", "HideAll");
                document.getElementById("ObjList").setAttribute("class", "hidemeall");
                document.getElementById("grayarea").setAttribute("class", "hideme");
            }
            /*
              This is called to search the list.  Once called by the first initial search or by the
              called search button so so that the options are seen and searched by this will limit the
              results
              Note that the options are remmed out if they don't exist else the javascript call errors
              out and the script fails and we don't get the list returned to us.
            */
            function getList(srch)
            {
                var dta = { "table": "GenSearch", "offset": "0", "Seltable": document.getElementById("table").value };
                if (srch == true)
                {
                    dta = {
                        "table": "GenSearch"
                        , "Seltable": document.getElementById("table").value
                    };
                    if (document.getElementById("Opt1"))
                    {
                        dta["Opt1"] = document.getElementById("Opt1").name;
                        dta["Par1"] = document.getElementById("Opt1").value
                    };
                    if (document.getElementById("Opt2"))
                    {
                        dta["Opt2"] = document.getElementById("Opt2").name;
                        dta["Par2"] = document.getElementById("Opt2").value
                    };
                    if (document.getElementById("Opt3"))
                    {
                        dta["Opt3"] = document.getElementById("Opt3").name;
                        dta["Par3"] = document.getElementById("Opt3").value
                    };

                };
                /*
                    The posting of the ajax call using jqry.  that dta var is set above
                */
                $.ajax({
                    type: "POST",
                    url: "/Report/FormHandler",
                    data: dta,
                    dataType: "json",

                    success: function (msg)
                    {
                        document.getElementById("lst").innerHTML = "";

                        var d = new Date;
                        rslts = msg;
                        var Struct = "";
                        for (var i = 0; i < msg.length; i++)
                        {
                            Struct += "<div class='lstcls' onclick='loadProd(" + msg[i]["rowid"] + ");'>" +
                                       "<div>" + msg[i]["rowid"] + "</div>" +
                                       "<div>" + msg[i][document.getElementById('s2').value] + "</div>" +
                                       "<div>" + msg[i][document.getElementById('s3').value] + "</div>" +
                                       "<div>" + msg[i][document.getElementById('s4').value] + "</div>" +
                                       "<div>" + msg[i][document.getElementById('s5').value] + "</div>" +
                                       "</div>";

                        }
                        document.getElementById("lst").innerHTML = Struct;

                    },
                    error: function (msg)
                    {
                        $("#formResponse").removeClass('success');
                        $("#formResponse").addClass('error');
                        $("#formResponse").html("There was an error submitting the form. Please try again." );
                    }
                });
                return false;
            }
            /*
              Once we have displaed the records and one has been selected, we now have one that is
              ready to be selected.  We get that via the qury here and populate it with the responseback.  
            */
            function loadProd(Recordnumber)
            {
                hidegrayarea();
                $.ajax({
                    type: "POST",
                    url: "/Report/FormHandler",
                    data: { "rowid": Recordnumber, "table": "getGen", "Seltable": document.getElementById("table").value },
                    dataType: "json",

                    success: function (msg)
                    {
                        /*
                        $("#formResponse").removeClass('error');
                        $("#formResponse").removeClass('success');
                        $("#formResponse").addClass(msg[0].status);
                        $("#formResponse").html(msg[0].message);
                        $("#formResponse").fadeOut(2000);
                        */

                        var d = new Date;
                        var itm;
                        rslts = msg;

                        var id = 0;

                        for (var x in rslts[id])
                        {
                            itm = document.getElementById(x.toLowerCase());
                            if (rslts[id][x] == null) { rslts[id][x] = ''; };
                            if (rslts[id][x] == 'null') { rslts[id][x] = ''; };
                            if (rslts[id][x] == '') { rslts[id][x] = ''; };
                            if (itm) { itm.innerHTML = rslts[id][x]; itm.value = rslts[id][x]; };
                        };
                    },
                    error: function ()
                    {
                        $("#formResponse").removeClass('success');
                        $("#formResponse").addClass('error');
                        $("#formResponse").html("There was an error submitting the form. Please try again.");
                    }
                });


                return false;

            }

            function SubmitInfo()
            {
                window.scrollTo(0, 0);

                $.ajax({
                    type: "POST",
                    url: "/DataEnt/FormHandler",
                    data: $("#Input").serialize(),
                    timeout: 4500,
                    dataType: "json",
                    success: function (msg)
                    {
                        var itm;
                        rslts = msg;

                        var id = 0;
                        if (document.getElementById('rowid').value == 0)
                        {
                            for (var x in rslts[id])
                            {
                                itm = document.getElementById(x.toLowerCase());
                                if (rslts[id][x] == null) { rslts[id][x] = ''; };
                                if (rslts[id][x] == 'null') { rslts[id][x] = ''; };
                                if (rslts[id][x] == '') { rslts[id][x] = ''; };
                                if (itm) { if (itm.nodeName == "TEXTAREA") { itm.value = rslts[id][x]; itm.innerHTML = rslts[id][x]; } else { itm.value = rslts[id][x]; } };
                            };
                        }

                        $("#formResponse").removeClass('error');
                        $("#formResponse").removeClass('success');
                        $("#formResponse").removeClass('success2');
                        $("#formResponse").addClass(msg[0]['status']);
                        $("#formResponse").html(msg[0]['message']);
                        $("#formResponse").css("display", "inherit");
                        $("#formResponse").fadeOut(2000);
                        newObj();
                    },
                    error: function (xhr, textStatus, errorThrown)
                    {
                        $("#formResponse").removeClass('success');
                        $("#formResponse").removeClass('success2');
                        $("#formResponse").addClass('error');
                        $("#formResponse").html("There was an error submitting the form. Please try again.<br><br>Error: " + textStatus);
                        window.scrollTo(0, 0);
                    }
                });
            }