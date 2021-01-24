import { Response } from 'express';
import { Service } from "typedi";
import axios from 'axios';
import dotenv from 'dotenv';

import { AuthService } from "../../services/auth.service";
import { AuthRequest } from "../../typings";
import * as Validate from '../../lib/validate/auth.validate';
import * as tokenLib from '../../lib/token.lib';
import * as colorConsole from '../../lib/console';

dotenv.config();

@Service()
export class AuthCtrl {
  constructor(
    private authService: AuthService,
  ) { }

  // 사용자 로그인 함수
  public login = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[POST] user login api was called');
    const { body } = req;

    // 로그인 요청 값 검사
    try {
      await Validate.loginValidate(body);
    } catch (error) {
      res.status(400).json({
        status: 400,
        message: '요청 오류!',
      });

      return;
    }

    try {
      const { memberId, pw } = body;

      // 회원 조회
      const member = await this.authService.login(memberId, pw);

      // 회원 조회 실패
      if (!member) {
        res.status(404).json({
          status: 404,
          message: '가입 되지 않는 회원!',
        });
  
        return;
      }

      // 토큰 발급
      const token = await tokenLib.createToken(memberId, member.accessLevel, member.profileImage);
      const refreshToken = await tokenLib.createRefreshToken(memberId);

      res.status(200).json({
        status: 200,
        message: '로그인 성공!',
        data: {
          token,
          refreshToken,
        }
      });
    } catch (error) {
      colorConsole.error(error);

      res.status(500).json({
        status: 500,
        message: '서버 에러',
      });
    }
  };

  public loginWithGithub = async (req: AuthRequest, res: Response) => {
    colorConsole.info('[POST] github login api was called');
    const { code } = req.body;

    if (!code) {
      res.status(400).json({
        status: 400,
        message: '요청 오류!',
      });

      return;
    }

    try {
      const response = await axios.post('https://github.com/login/oauth/access_token', {
        code,
        client_id: process.env.GIT_HUB_CLIENT_ID,
        client_secret: process.env.GIT_HUB_CLIENT_SECRET,
      }, {
        headers: {
          accept: 'application/json',
        },
      });

      const gihubToken = response.data.access_token;

      const { data } = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `token ${gihubToken}`,
        },
      });

      const { login, id, avatar_url, name } = data;

      const member = await this.authService.findUserById(id);

      if (!member) {
        const memberData = {
          memberId: id,
          pw: 'no needs password',
          accessLevel: 1,
          memberName: name,
          profileImage: avatar_url,
        };

        await this.authService.createUserWithGithub(memberData);
      }

      const token = await tokenLib.createToken(id, 1, avatar_url);
      
      res.status(200).json({
        status: 200,
        message: '깃헙 로그인 성공!',
        data: {
          token,
        },
      });
        
    } catch (error) {
      colorConsole.error(error);

      res.status(500).json({
        status: 500,
        message: '서버 에러',
      });
    }
  };

  public registerAccount = async (req: AuthRequest, res: Response) => {
    const { body } = req;

    try {

    } catch (error) {
      res.status(400).json({
        status: 400,
        message: '요청 오류!',
      });

      return;
    }

    try {

    } catch (error) {
      colorConsole.error(error);

      res.status(500).json({
        status: 500,
        message: '서버 에러',
      });
    }
  };

}