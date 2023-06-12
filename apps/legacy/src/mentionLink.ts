export const getEntHost = () => {
  const hostname = window.location.hostname;

  if (/gitee\.com/.test(hostname)) {
    return 'https://e.gitee.com';
  }

  if (/.+\.runjs\.cn/.test(hostname)) {
    const id = hostname.split('.')[0];
    return `https://${id}-ent.runjs.cn`;
  }

  return 'https://e.gitee.com';
};

export const members = {
  linkReg: {
    // /gigi-two222/members/trend/git
    ent: /\/members\/trend\//,
  },
  getLink: (path: string) => {
    if (members.linkReg.ent.test(path)) {
      return getEntHost() + path;
    }
    return path;
  },
};

export const issues = {
  linkReg: {
    //  /gigi-two222/dashboard?issue=I1SIQ
    ent: /\?issue=I/i,
    //  /gigi-two222/test-scan/issues/I1SJH
    community: /\/issues\/I/,
  },
  getLink: (path: string) => {
    if (issues.linkReg.community.test(path)) {
      return path;
    }

    if (issues.linkReg.ent.test(path)) {
      return getEntHost() + path;
    }

    return path;
  },
};

export const pulls = {
  linkReg: {
    // /gigi-two222/repos/gigi-two222/huhu2_kaiyuan/pulls/1
    ent: /\/repos\/.+\/pulls\//,
  },
  getLink: (path: string) => {
    if (pulls.linkReg.ent.test(path)) {
      return getEntHost() + path;
    }
    return path;
  },
};
