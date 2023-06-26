package com.tx_server.sc_test.controller;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.tx_server.sc_test.service.IndexHttpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Controller
public class indexController {
    @Autowired
    private IndexHttpService indexHttpService;

    @RequestMapping(path = "/correction", method = RequestMethod.GET)
    public String getRightResult(Model model, String sentence){
        //String url ="http://192.168.0.109:5000/inferCorrect?text="+sentence+"";
        String url ="http://124.221.174.224:5000/inferCorrect?text="+sentence+"";
        HttpMethod method = HttpMethod.GET;
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        String client = indexHttpService.client(url, method, params);
        JSONObject jsonObject =  JSON.parseObject(client);
        String correct_sent = jsonObject.getString("correct_sent");
//        System.out.println(correct_sent);
        //String detail = jsonObject.getString("detail");
        model.addAttribute("correctionMsg",correct_sent);
        //model.addAttribute("placeMsg",detail);


        return "site/correction";
    }

    @RequestMapping(path = "/consistency", method = RequestMethod.GET)
    public String getConsistencyResult(Model model,String sentence_A){
        System.out.println(sentence_A);
        String url ="http://124.221.174.224:5000/inferCoherence?text_A='"+sentence_A+"'";
        System.out.println(url);
        HttpMethod method = HttpMethod.GET;
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        String client = indexHttpService.client(url, method, params);
        JSONObject jsonObject =  JSON.parseObject(client);
        System.out.println(jsonObject);
        String result = jsonObject.getString("detail");
        model.addAttribute("consistencyMsg",result);
        return "site/consistency";
    }

    @RequestMapping(path = "/match", method = RequestMethod.GET)
    public String getMatchResult(Model model,String sentence_B){
        //我做了双眼皮方式
        System.out.println(sentence_B);
        String url ="http://124.221.174.224:5001/api/detect/"+sentence_B+"/";
        HttpMethod method = HttpMethod.GET;
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        String client = indexHttpService.client(url, method, params);
        JSONObject jsonObject =  JSON.parseObject(client);
        System.out.println(jsonObject);
        String result_1 = jsonObject.getString("含有错误搭配的句子");
        //System.out.println(result_1);
        String result_2 = jsonObject.getString("搭配错误词语");
        //System.out.println(result_2);
        model.addAttribute("matchSentenceMsg",result_1);
        model.addAttribute("matchWordsMsg",result_2);

        return "site/match";
    }


    @RequestMapping(path = "/recommend", method = RequestMethod.GET)
    public String getMatchRecommend(Model model,String sentence_C,String word){
        //我做了双眼皮芜湖 芜湖
        String url ="http://124.221.174.224:5001/api/advice/"+sentence_C+"/"+word+"/";
        HttpMethod method = HttpMethod.GET;
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        String client = indexHttpService.client(url, method, params);
        JSONObject jsonObject =  JSON.parseObject(client);
        System.out.println(jsonObject);
        String result_1 = jsonObject.getString("推荐句子");
        //System.out.println(result_1);
        String result_2 = jsonObject.getString("推荐词语");
        //System.out.println(result_2);
        model.addAttribute("recommendSentenceMsg",result_1);
        model.addAttribute("recommendWordsMsg",result_2);

        return "site/recommend";
    }

    @RequestMapping(path = "/to_correction", method = RequestMethod.GET)
    public String to_correction(){
        return "site/correction";
    }
    @RequestMapping(path = "/to_consistency", method = RequestMethod.GET)
    public String to_consistency(){
        return "site/consistency";
    }
    @RequestMapping(path = "/to_match", method = RequestMethod.GET)
    public String to_match(){
        return "site/match";
    }
    @RequestMapping(path = "/to_recommend", method = RequestMethod.GET)
    public String to_recommend(){
        return "site/recommend";
    }


    @RequestMapping(path = "/to_model", method = RequestMethod.GET)
    public String to_model(){
        return "model";
    }

    @RequestMapping(path = "/index", method = RequestMethod.GET)
    public String index(){
        return "index";
    }

    @RequestMapping(path = "/to_text", method = RequestMethod.GET)
    public String to_text(){
        return "text_semantic_01";
    }

    @RequestMapping(path = "/to_spatio", method = RequestMethod.GET)
    public String to_spatio(){
        return "spatio_temporal_02";
    }

    @RequestMapping(path = "/to_intelligent", method = RequestMethod.GET)
    public String to_intelligent(){
        return "intelligent_system_03";
    }

    @RequestMapping(path = "/to_cognitive", method = RequestMethod.GET)
    public String to_cognitive(){
        return "cognitive_computing_04";
    }

    //20宋程
    @RequestMapping(path = "/to_enhance_quality")
    public String to_enhance_quality(){
        return "redirect:http://www.15zhi.net/sc_quality/";
//        return "redirect:http://124.221.174.224:7183";
    }

    //20孙俊
    @RequestMapping(path = "/to_network")
    public String to_network(){
        return "redirect:http://www.15zhi.net/anomaly-detection";
    }

    //20曹骏
    @RequestMapping(path = "/to_data_fill")
    public String to_data_fill(){
        return "redirect:http://www.15zhi.net/caojun";
    }

    //20翟彬
    @RequestMapping(path = "/to_risk_quality") 
    public String to_risk_quality(){
        return "redirect:http://124.221.174.224:5005/";
    }

    //李婷婷
    @RequestMapping(path = "/to_litingting", method = RequestMethod.GET)
    public String to_litingting(){
        return "site/litingting";
    }

    //20杨迪
    @RequestMapping(path = "/to_yangdi", method = RequestMethod.GET)
    public String to_yangdi(){
        return "site/yangdi";
    }





}
