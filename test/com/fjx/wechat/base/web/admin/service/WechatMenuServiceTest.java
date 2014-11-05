package com.fjx.wechat.base.web.admin.service;


import java.util.Date;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;

import com.fjx.wechat.base.vo.menu.Menu;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("/spring.xml")
public class WechatMenuServiceTest {
	
	@Autowired
	private WechatMenuService menuService;
	@Autowired
	private SysUserService sysUserService;
	
	@Test
	public void testLoadMenu() throws Exception {
		try {
			Menu menu = menuService.loadMenu(sysUserService.load("4028818c48bc2c570148bc62ae4d0004"));
			Menu menu2 = menu;
			System.out.println(menu2);
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
	
	
	@Test
	public void testRelease() throws Exception {
		try {
			menuService.release(sysUserService.load("4028818c48bc2c570148bc62ae4d0004"));
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}
	
	
	public static void main(String[] args) {
		System.out.println(System.currentTimeMillis());
	}
}
