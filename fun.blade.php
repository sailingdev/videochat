@extends('layouts/app')
@section('content')

<div class="row">
    {!! csrf_field() !!}
    <div class="col-md-9">
        <div class="blog-posts single-post">
            <article class="post post-large blog-single-post">
                <div class="row center">
                    <a type="button" class="btn btn-default pull-left" style="margin-top: 20px;" onclick="window.close()">닫 기</a>
                    <h3 style="color: #0088cc">{{$obj['innerTitle']}}</h3>
                    <div class="row" style="height: 1px; background: #000000; margin: 10px 0 0px 0;"></div>
                    <div class="post-meta pull-right" style="margin: 10px 0 10px 0; color: #adadad;">
                        <span style="border-right: 1px solid #ababab; margin-left: 10px;"><i class="fa fa-tag"></i> {{$obj['tag']}}</span>
                        <span style="border-right: 1px solid #ababab; margin-left: 10px;"><i class="fa fa-eye"></i> openCnt : {{$obj['openCnt']}}</span>
                        <span style="border-right: 1px solid #ababab; margin-left: 10px;"><i class="fa fa-thumbs-o-up"></i> agreeCnt : {{$obj['agreeCnt']}}</span>
                        <span style="border-right: 1px solid #ababab; margin-left: 10px;"><i class="fa fa-thumbs-o-down"></i> disagreeCnt : {{$obj['disagreeCnt']}}</span>
                        <span style="border-right: 1px solid #ababab; margin-left: 10px;"><i class="fa fa-comments-o"></i> commentCnt : {{$obj['commentCnt']}}</span>
                        <span style=" margin-left: 10px;"><i class="fa fa-calendar"></i> date : {{$obj['date']}}</span>
                    </div>
                </div>
                <div class=" row post-content">
                    @if($obj['type'] == 'compare')
                        <textarea class="chongbong" style="width: 100%; min-height: 400px; font-size: 2.3rem; color: black; padding: 30px; box-shadow: 0px 0px 5px -1px; background-color: rgba(158, 169, 220, 0.05); line-height: 120%;">{{$obj['content']}}</textarea>
                    @elseif($obj['type'] == 'analysis')
                        <div style="min-height: 400px; font-size: 2.3rem; color: black; padding: 30px; box-shadow: 0px 0px 5px -1px; background-color: rgba(158, 169, 220, 0.05); resize: vertical; overflow: auto; line-height: 120%;">{!! $obj['content'] !!}</div>
                    @elseif($obj['type'] == 'idea')
                        <textarea class="chongbong" style="width: 100%; min-height: 400px; font-size: 2.3rem; color: black; padding: 30px; box-shadow: 0px 0px 5px -1px; background-color: rgba(158, 169, 220, 0.05); line-height: 120%;">{!! $obj['content'] !!}</textarea>
                    @endif

                    <!-- Comments -->
                    <section class="panel panel-default" data-portlet-item style="margin-top: 15px; border-color: transparent;">
                        <header class="panel-heading portlet-handler" style="background-color: white;">
                            <div class="panel-actions">
                                <a href="#" class="panel-action panel-action-toggle" data-panel-toggle style="color: #0088cc"></a>
                            </div>

                            <h2 class="panel-title" style="color: #0088cc; font-size: 1.8em; font-weight: 200;"><i class="fa fa-comments"></i> commentCnt ({{$obj['commentCnt']}})</h2>
                        </header>
                        <div class="panel-body" style="background: white; padding: 0;">
                            <?php
                                function traverse($node, $vector, $comments){
                                    $html = '';
                                    if($node['id'] != 0)
                                        $html = ('<li>
                                                    <div class="comment">
                                                        <div class="img-thumbnail" style="border: 0;">
                                                            <img class="avatar" style="width:auto;" src='. url($comments[$node["arrayId"]]["photo"]) .'>
                                                        </div>
                                                        <div class="comment-block">
                                                            <div class="comment-arrow"></div>
                                                            <span class="comment-by">
                                                                <strong>by ' .($comments[$node["arrayId"]]["author"]) .'</strong>
                                                                <span class="pull-right">
                                                                    <span> <a class="btn-opinion modal-basic"  href="#modalHeaderColorPrimary" ownId="' .($comments[$node["arrayId"]]["id"]) .'" ownDepth="' .($comments[$node["arrayId"]]["depth"]) .'"><i class="fa fa-reply"></i> ttt</a></span>
                                                                </span>
                                                            </span>
                                                            <pre style="border: none; padding: 0; margin: 0; background-color: #f4f4f400;">' .($comments[$node["arrayId"]]["content"]).'</pre>
                                                            <span class="date pull-right">' .($comments[$node["arrayId"]]["date"]) .'</span>
                                                        </div>
                                                    </div>
                                                ');

                                    if(isset($vector[$node['id']])){
                                        $html .= '<ul class="comments">';
                                        foreach($vector[$node['id']] as $child){
                                            $html .= traverse($child, $vector, $comments);
                                        }
                                        $html .= "</ul>";
                                    }
                                    if($node['id'] != 0)
                                        $html .= "</li>";

                                    return $html;
                                }

                                $vector = [];
                                foreach($comments as $comment){
                                    $vector[$comment['parentId']][] = ['id'=>$comment['id'], 'arrayId'=>$comment['arrayId']];
                                }

//                                echo json_encode($comments);
//                                echo "<br/>";
//                                echo "<br/>";
//                                echo json_encode($vector);
//                                die();

                                /*echo json_encode($vector);
                                die();*/
                                $node = ['id'=>0, 'arrayId'=>0];
                                echo traverse($node, $vector, $comments);
                            ?>
                        </div>
                    </section>

                                        <!-- Marking Modal -->
                    <a class="btn-opinion mb-xs mt-xs mr-xs modal-basic btn btn-primary pull-right" href="#modalHeaderColorPrimary" ownId="0" ownDepth="0">estimation</a>

                    <div id="modalHeaderColorPrimary" class="modal-block modal-block-lg modal-header-color modal-block-primary mfp-hide" style="margin: 0px auto;" opId="0">
                        <section class="panel">
                            <header class="panel-heading">
                                <h2 class="panel-title center">{{$obj['title']}}</h2>
                            </header>
                            <div class="panel-body">
                                <div class="modal-wrapper" style="padding: 0px 30px;">
                                    <?php 
                                        $i = 1;
                                    ?>
                                    @foreach($measures as $measure)
                                        <p  style="min-height: 30px; margin-top: 15px;">
                                            <input type="number" data-msg-required="input mark" class="form-control pull-left marks" placeholder="점수" autocomplete="off" style="width: 80px; margin-right: 10px;">
                                            <span style="padding-top: 15px;">center {{$i++}} : {{$measure['content']}}</span>
                                        </p>
                                    @endforeach

                                    <textarea id="opinion" data-msg-required="..." rows="5" class="form-control" placeholder="..."></textarea>
                                </div>

                            </div>
                            <footer class="panel-footer">
                                <div class="row">
                                    <div class="col-md-12 text-right">
                                        <button id="btn-submit" class="btn btn-primary" ownId="-1" ownDepth="1">submit</button>
                                        <button id="btn-cancel" class="btn btn-default modal-dismiss">닫 기</button>
                                    </div>
                                </div>
                            </footer>
                        </section>
                    </div>

                </div>
            </article>

        </div>
    </div>

    <div class="col-md-3" style="margin-top: 30px;">
        <div class="row center">
            <h3>{{$obj['writer']}}</h3>
            <img class="avatar" style="max-height: 150px; width:auto; border: 1px solid #ddd; border-radius: 5px;" src="{{url($photo)}}">
        </div>
        <div class="center">
            <button id="btn-favourite" type="button" class="btn btn-success m-xs" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="즐겨찾기"><i class="fa fa-heart"></i></button>
        </div>
    </div>
</div>

<script type="text/javascript">

    var srcId = {{$srcId}};
    
    $(document).ready(function(){

        $("#btn-favourite").click(function(){
            var _token = $("input[name='_token'").val();
            
            $.ajax({
                url: '/articlefavourite',
                type: 'post',
                data: {
                    srcId, srcId,
                    _token: _token
                },
                success: function(data) {
                    if(data == 'saved')
                        notify('', '', 'success', 'click-2-close');
                    else
                        notify('', '', 'alert', 'click-2-close');
                },
                fail: function(data) {
                    notify('', '', 'success', 'notification-dark click-2-close');
                }
            });
        });

        $("#btn-cancel").click( function(){

            var opinion = $("#opinion").val("");
            var markObjArray = $(".marks");
            for(var i = 0; i < markObjArray.length; i++) {
                markObjArray[i].value = "";
            }
        });

        $("#btn-submit").click( function(){

            var _token = $("input[name='_token']").val();

            var opId = $("#modalHeaderColorPrimary").attr("opId");
            var ownId = $(this).attr('ownId');
            var ownDepth = $(this).attr('ownDepth');

            var opinion = $("#opinion").val();
            var markObjArray = $(".marks");
            var marks = [];
            var avg = 0;
            var emptyFlag = 1;

            var count = 0
            if(markObjArray.length > 0) {
                for(var i = 0; i < markObjArray.length; i++) {
                    marks.push(markObjArray[i].value);
                    if(markObjArray[i].value != '') {

                        emptyFlag = 0;
                        avg += markObjArray[i].value / 1;
                        count ++;
                    }
                }
            }
            avg /= count;

            if(opinion == '' && emptyFlag == 1) {
                notify('', '', 'error', 'click-2-close');
                return;
            }
            
            $.ajax({
                url: '/opinonsave',
                type: 'post',
                data: {
                    marks: marks, opinion: opinion, avg: avg, srcId: srcId, ownId: opId, parentId: ownId, parentDepth: ownDepth,
                    _token: _token
                },
                success: function(data) {
                    $("#modalHeaderColorPrimary").attr("opId", data);
                    notify('', '', 'success', 'click-2-close');
                },
                fail: function(data) {
                    notify('', '', 'success', 'notification-dark click-2-close');
                }
            });
        });
    });

    $('body').on('click', '.btn-opinion', function(){
            var ownId = $(this).attr('ownId');
            var ownDepth = $(this).attr('ownDepth');

            $("#btn-submit").attr('ownId', ownId);
            $("#btn-submit").attr("ownDepth", ownDepth);

            $("#modalHeaderColorPrimary").attr("opId", -1);
    });

    function notify(pTitle, pContent, pType, pClass) {
        var notice = new PNotify({
          title: pTitle,
          text: pContent,
          type: pType,
          addclass: pClass,
          hide: false,
          buttons: {
            closer: false,
            sticker: false
          }
        });

        notice.get().click(function() {
            notice.remove();
        });
    }
</script>
@endsection