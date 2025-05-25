#!/usr/bin/bash

# https://github.com/acmesh-official/acme.sh/issues/3512

dns_hedyn_add() {
  fulldomain=$1
  txtvalue=$2

  HEdyn_key="${HEdyn_key:-$(_readdomainconf HEdyn_key)}"
  if [ "$HEdyn_key" ]; then
    _savedomainconf HEdyn_key "$HEdyn_key"
  elif [ -z "$HEdyn_key" ]; then
    _err "You didn't specify HEdyn_key environment variable."
    return 1
  fi

  hostname_encoded="$(printf "%s" "${fulldomain}" | _url_encode)"
  password_encoded="$(printf "%s" "${HEdyn_key}" | _url_encode)"
  txt_encoded="$(printf "%s" "${txtvalue}" | _url_encode)"
  body="hostname=${hostname_encoded}&password=${password_encoded}&txt=${txt_encoded}"
  response=$(_post "$body" "https://dyn.dns.he.net/nic/update")
  test $response == 'good'
}
