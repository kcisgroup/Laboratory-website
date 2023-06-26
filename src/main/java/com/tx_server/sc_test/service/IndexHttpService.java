package com.tx_server.sc_test.service;


import com.fasterxml.jackson.databind.util.JSONPObject;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
@Component("IndexHttpService")
public class IndexHttpService {
    //调用外部接口
    public String client(String url, HttpMethod method, MultiValueMap<String, String> params) {
        RestTemplate template =new RestTemplate();
        ResponseEntity<String> response1 = template.getForEntity(url, String.class);
        System.out.println(response1.getBody());
        return response1.getBody();
    }

}
