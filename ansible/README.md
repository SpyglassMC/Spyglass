An Ansible playbook for managing cloud infrastructure used by Spyglass's various services.

Current managed services:

* API: https://api.spyglassmc.com
* Discord bot
* Weblate: https://weblate.spyglassmc.com

Ansible variables:

* See each role's default variables.

# Local Testing

One easy way to test the playbook locally is to use [Incus][incus] to launch a system container
running a Debian 13 image and run the playbook against it.

## Launch and configure a container

In this section the container will be named `spyglassmc-dev`, but anything would work.

1. [Install Incus][incus-install].
2. Launch a container by e.g.
   ```
   $ incus launch images:debian/13 spyglassmc-dev
   ```
3. Install necessary packages in the container
   ```
   $ incus exec spyglassmc-dev -- bash -c "apt update && apt install -y openssh-server python3 && systemctl enable ssh --now"
   ```
5. Create a user on the container that Ansible will SSH as
   ```
   $ incus exec spyglassmc-dev adduser ansible
   $ incus exec spyglassmc-dev -- usermod -aG sudo ansible
   ```

## Create a local inventory file

1. Gather the IP address of the container
   ```
   $ incus info spyglassmc-dev | grep "inet.*global"
   ```
2. Create an inventory file `inventory-dev.yml` with the IP address of the container. Include any
   variables in either host vars or another separate extra variables file. Reference
   `secrets-template.yml` for a list of variables.
   * Contact @SPGoding for `acmesh_dynamic_dns_key` if you'd like working acmesh verification for
     `dev.spyglassmc.com`.

3. Run the playbook
   ```
   $ ansible-playbook -i ansible/inventory-dev.yml ansible/playbook.yml
   ```

[incus]: https://linuxcontainers.org/incus/
[incus-install]: https://linuxcontainers.org/incus/docs/main/installing/
