export type Project = {
  name: string;
  description: string;
  html_url: string;
  language: string;
  license: {
    name: string;
    spdx_id: string;
  };
};
