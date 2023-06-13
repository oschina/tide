import React from 'react';
import cls from 'classnames';
import FeatureIcon from './assets/type-1.svg';
import TaskIcon from './assets/type-2.svg';
import BugIcon from './assets/type-3.svg';

import './index.less';

const i18n = {
  en: {
    bug: 'Bug',
    feature: 'Feature',
    task: 'Task',
  },
  zh_CN: {
    bug: '缺陷',
    feature: '需求',
    task: '任务',
  },
};

export type IssueCategory = 'feature' | 'requirement' | 'task' | 'bug';

const IssueIcons = ({
  className,
  category,
  local = 'zh_CN',
}: {
  className?: string;
  category: IssueCategory;
  local?: 'zh_CN' | 'en';
}) => {
  const localText = i18n[local];
  const iconMap = {
    feature: {
      title: localText.feature,
      src: FeatureIcon,
    },
    requirement: {
      title: localText.feature,
      src: FeatureIcon,
    },
    task: {
      title: localText.task,
      src: TaskIcon,
    },
    bug: {
      title: localText.bug,
      src: BugIcon,
    },
  };
  const issueIcon = iconMap[category || 'feature'];

  return (
    <span className={cls('tide-issue-type-icon', className)}>
      <img src={issueIcon.src} alt={issueIcon.title} title={issueIcon.title} />
    </span>
  );
};

export default IssueIcons;
